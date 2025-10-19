import { GoogleGenAI, Modality, Part, GenerateContentResponse } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';
import { firebaseConfig } from "../firebase";

const API_KEY = firebaseConfig.apiKey;
if (!API_KEY) {
  throw new Error("API_KEY could not be loaded from firebaseConfig");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateCompositeImage(images: File[], themePrompt: string, feedback?: string, faceLock: boolean = true): Promise<string> {
    const imageParts: Part[] = await Promise.all(
        images.map(async (image) => {
            const base64Data = await fileToBase64(image);
            return {
                inlineData: {
                    data: base64Data,
                    mimeType: image.type,
                },
            };
        })
    );
    
    let feedbackInstruction = '';
    if (feedback) {
        feedbackInstruction = `
        **USER FEEDBACK ON PREVIOUS ATTEMPT (HIGHEST PRIORITY CORRECTION):**
        The user was not satisfied with the last image. Their feedback is: "${feedback}".
        You **MUST** analyze this feedback and correct your approach. This feedback overrides all other rules if there is a conflict.
        `;
    }

    const faceLockInstructions = `
**RULE #2: ZERO-TOLERANCE FACIAL PRESERVATION (SECOND PRIORITY)**
*   This rule only applies *after* you have satisfied Rule #1.
*   You must perform a perfect "digital transplant" of each original person's face from the source images onto the new bodies.
*   **DO NOT** alter, re-render, stylize, or change the facial features, structure, or expression in any way.
*   The faces of original people in the output must be identical to the faces in the input.

**RULE #2A: GEOMETRIC LOCKDOWN OF FACIAL LANDMARKS (TECHNICAL SPECIFICATION)**
*   This is a sub-process of Rule #2 and is non-negotiable.
*   For each original person's face, you must perform a landmark detection analysis and create a geometric map.
*   **Landmarks to Map:** You must precisely map the geometry of the following features:
    *   **Eyes:** Exact shape, size, spacing, and corner positions.
    *   **Nose:** Exact bridge width, nostril shape, and tip position.
    *   **Mouth:** Exact lip curvature, thickness, and corner positions.
    *   **Jawline:** The precise contour from ear to chin.
    *   **Eyebrows:** The exact arc, thickness, and position relative to the eyes.
*   **CRITICAL:** The geometric map created from the source image is immutable. In the final composite, the landmarks **MUST** have the identical position, size, shape, and spatial relationship to each other as defined in the original map. Any deviation, however minor, constitutes a task failure. This is a geometric constraint, not an artistic guideline.
`;

    const textPart: Part = {
        text: `${feedbackInstruction}

**CRITICAL DIRECTIVES & HIERARCHY OF RULES**

Your task is to create a single, composite photograph in English. You must follow these rules in the exact order of priority. Failure to follow this hierarchy is a failure of the entire task.

**RULE #1: PERSON COUNT INTEGRITY (ABSOLUTE HIGHEST PRIORITY)**
*   Your most important task is to analyze all provided images and count the total number of unique individuals.
*   The final generated image **MUST** contain this exact number of people.
*   **CRITICAL FAILURE CONDITION:** Generating an image with the wrong number of people is a complete failure. **DO NOT ADD OR REMOVE ANYONE**.

${faceLock ? faceLockInstructions : ''}

**RULE #3: PHOTOGRAPHIC AUTHENTICITY (THIRD PRIORITY)**
*   **Core Mandate: Emulate a Physical Camera.** Your goal is to generate an image that appears to have been captured by a high-end physical camera lens and sensor, not created on a computer.
*   **Absolute Prohibition of Digital Artifacts:** The final image **MUST NOT** have any characteristics of a digital painting, 3D render, or airbrushed art. Explicitly forbid: unnaturally smooth skin, plastic-like textures, a "CG look," or soft, undefined details.
*   **Micro-Texture and Detail Imperative:** This is a critical instruction. All surfaces must contain realistic micro-textures to avoid a "smooth" or "3D" appearance.
    *   **Skin:** Render with utmost fidelity. This includes visible pores, subtle blemishes, fine vellus hairs, and natural, complex specular highlights.
    *   **Fabric:** The thread pattern, weave, and subtle wrinkling of all clothing must be rendered with high precision.
    *   **Hair:** Individual strands must be visible, with realistic flyaways and complex light interaction.
*   **Emulate Optical Physics:**
    *   **Lighting:** Must be complex and natural, with soft shadows, bounced light, and realistic falloff.
    *   **Lens Effects:** Introduce subtle, physically accurate depth of field (bokeh). Add a minuscule amount of realistic film grain or sensor noise to break up digital uniformity and enhance authenticity.

**RULE #4: THE CREATIVE TASK (LOWEST PRIORITY)**
*   Only after you have satisfied all the rules above may you proceed with the creative portion.
*   Generate a new background, bodies, clothing, and poses based on the user's theme.

**EXECUTE TASK:** Generate an image based on the theme: '${themePrompt}'.`,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [textPart, ...imageParts] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    const imagePart = response?.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
    );

    if (imagePart && imagePart.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    // FIX: The .text property is not available on image generation responses.
    // Instead, extract any available text part for a more informative error.
    const errorPart = response?.candidates?.[0]?.content?.parts?.find(p => p.text);
    const errorText = errorPart?.text || "No specific reason provided by the AI.";
    console.error("Image generation failed. AI Response:", errorText);
    throw new Error(`No image was generated. The AI may have refused the request. Reason: ${errorText}`);
}

export async function animateImage(base64Image: string, themePrompt: string, durationInSeconds: number, feedback?: string): Promise<string> {
    const mimeType = base64Image.split(';')[0].split(':')[1];
    const imageData = base64Image.split(',')[1];
    
    let feedbackInstruction = '';
    if (feedback) {
        feedbackInstruction = `
        **USER FEEDBACK ON PREVIOUS ANIMATION (HIGHEST PRIORITY CORRECTION):**
        The user provided feedback on the last video: "${feedback}".
        You **MUST** address this feedback. If they say "the movement is jerky," create a smoother animation. If they said "it changed his face," you must be even more strict about not altering faces. This feedback is a non-negotiable directive.
        `;
    }
    
    const animationPrompt = `${feedbackInstruction}
    
**CRITICAL RULE: DO NOT CHANGE FACES.** The faces and facial features of the people in this image are perfect as they are. You **MUST NOT** alter, re-render, distort, or change them in any way. The animation must preserve their exact likeness. This is the most important rule.

**ANIMATION DIRECTIVES:**

1.  **Seamless Loop & Duration:** Generate a high-quality, ${durationInSeconds}-second animation that is a **perfect, seamless loop**. The last frame must transition smoothly back to the first frame.
2.  **Context-Aware Motion:** Analyze the provided theme to determine the animation's style and intensity. The original scene is: "${themePrompt}".
    *   For **action-oriented or dynamic themes** (e.g., 'superheroes', 'adventurous'), create more noticeable, dynamic, yet realistic movements.
    *   For **calm, romantic, or portrait themes** (e.g., 'formal portrait', 'cozy cafe', 'romantic'), the motion should be extremely subtle and gentle (e.g., slight smiles, slow blinks, shifting gaze, gentle sway of clothing).
    *   For **landscapes or scenes with natural elements**, animate those elements gently (e.g., leaves rustling, water rippling, clouds drifting).
3.  **Technical Constraints:**
    *   The overall camera position **MUST** remain static. Do not pan, zoom, or tilt.
    *   The animation must be beautiful, realistic, and perfectly match the artistic style of the source image.
    *   Enhance the existing image, do not fundamentally change its composition.

Execute the animation based on these rules.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: animationPrompt,
        image: {
            imageBytes: imageData,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
    }
    
    if (operation.error) {
        console.error("Video generation operation failed:", operation.error);
        throw new Error("Video generation failed. " + operation.error.message);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no link.");
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
    const videoBlob = await videoResponse.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    return videoUrl;
}