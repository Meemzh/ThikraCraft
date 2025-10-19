import { PoseCategory, ThemeCategory } from './types';

export const POSE_CATEGORIES: PoseCategory[] = [
    {
        id: 'couples',
        nameKey: 'poses.categories.couples',
        options: [
            { id: 'couples_romantic', nameKey: 'poses.couples.romantic', promptFragment: 'a romantic couple pose, holding hands' },
            { id: 'couples_playful', nameKey: 'poses.couples.playful', promptFragment: 'a playful couple pose, laughing together' },
            { id: 'couples_hugging', nameKey: 'poses.couples.hugging', promptFragment: 'a couple hugging closely and warmly' },
            { id: 'couples_dancing', nameKey: 'poses.couples.dancing', promptFragment: 'a couple dancing together elegantly' },
            { id: 'couples_forehead_kiss', nameKey: 'poses.couples.foreheadKiss', promptFragment: 'a tender moment with a forehead kiss' },
        ]
    },
    {
        id: 'family',
        nameKey: 'poses.categories.family',
        options: [
            { id: 'family_classic', nameKey: 'poses.family.classic', promptFragment: 'a classic family portrait pose, smiling at the camera' },
            { id: 'family_fun', nameKey: 'poses.family.fun', promptFragment: 'a fun, candid family pose, interacting with each other' },
            { id: 'family_group_hug', nameKey: 'poses.family.groupHug', promptFragment: 'a warm family group hug' },
            { id: 'family_playing', nameKey: 'poses.family.playing', promptFragment: 'a family playing together outdoors' },
            { id: 'family_walking', nameKey: 'poses.family.walking', promptFragment: 'a family walking together in nature, holding hands' },
        ]
    },
     {
        id: 'friends',
        nameKey: 'poses.categories.friends',
        options: [
            { id: 'friends_side_by_side', nameKey: 'poses.friends.sideBySide', promptFragment: 'friends standing side-by-side, arms around each other' },
            { id: 'friends_laughing', nameKey: 'poses.friends.laughing', promptFragment: 'a group of friends laughing together candidly' },
            { id: 'friends_cheers', nameKey: 'poses.friends.cheers', promptFragment: 'friends making a toast or cheering with drinks' },
            { id: 'friends_selfie', nameKey: 'poses.friends.selfie', promptFragment: 'a fun group selfie pose' },
            { id: 'friends_adventure', nameKey: 'poses.friends.adventure', promptFragment: 'a group of friends in an adventurous pose, like looking at a map or pointing to the horizon' },
        ]
    },
    {
        id: 'solo',
        nameKey: 'poses.categories.solo',
        options: [
            { id: 'solo_confident', nameKey: 'poses.solo.confident', promptFragment: 'a confident solo pose, looking directly at the camera' },
            { id: 'solo_thoughtful', nameKey: 'poses.solo.thoughtful', promptFragment: 'a thoughtful solo pose, looking away from the camera' },
            { id: 'solo_action', nameKey: 'poses.solo.action', promptFragment: 'a dynamic action shot of a single person' },
            { id: 'solo_relaxed', nameKey: 'poses.solo.relaxed', promptFragment: 'a relaxed solo pose, sitting or leaning comfortably' },
        ]
    }
];

export const THEME_CATEGORIES: ThemeCategory[] = [
    {
        id: 'travel',
        nameKey: 'themes.categories.travel',
        options: [
            { id: 'travel_paris', nameKey: 'themes.travel.paris', promptFragment: 'in Paris with the Eiffel Tower in the background' },
            { id: 'travel_beach', nameKey: 'themes.travel.beach', promptFragment: 'on a beautiful tropical beach at sunset' },
            { id: 'travel_mountains', nameKey: 'themes.travel.mountains', promptFragment: 'hiking in a scenic, misty mountain range' },
            { id: 'travel_tokyo', nameKey: 'themes.travel.tokyo', promptFragment: 'on a busy, neon-lit street in Tokyo at night' },
            { id: 'travel_ruins', nameKey: 'themes.travel.ruins', promptFragment: 'exploring ancient ruins in a jungle' },
        ]
    },
    {
        id: 'celebrations',
        nameKey: 'themes.categories.celebrations',
        options: [
            { id: 'celebrations_wedding', nameKey: 'themes.celebrations.wedding', promptFragment: 'at a beautiful, flower-filled wedding ceremony' },
            { id: 'celebrations_birthday', nameKey: 'themes.celebrations.birthday', promptFragment: 'at a fun birthday party with confetti and balloons' },
            { id: 'celebrations_newyear', nameKey: 'themes.celebrations.newYear', promptFragment: 'celebrating New Year\'s Eve with spectacular fireworks' },
            { id: 'celebrations_graduation', nameKey: 'themes.celebrations.graduation', promptFragment: 'at a university graduation ceremony, wearing caps and gowns' },
            { id: 'celebrations_holiday_dinner', nameKey: 'themes.celebrations.holidayDinner', promptFragment: 'at a festive holiday dinner with family or friends' },
        ]
    },
    {
        id: 'portraits',
        nameKey: 'themes.categories.portraits',
        options: [
            { id: 'portraits_studio', nameKey: 'themes.portraits.studio', promptFragment: 'in a professional studio portrait setting with a simple background' },
            { id: 'portraits_outdoor', nameKey: 'themes.portraits.outdoor', promptFragment: 'in a soft-lit outdoor portrait setting, during the golden hour' },
            { id: 'portraits_vintage', nameKey: 'themes.portraits.vintage', promptFragment: 'in a vintage, black-and-white portrait style' },
            { id: 'portraits_dramatic', nameKey: 'themes.portraits.dramatic', promptFragment: 'a dramatic portrait with strong shadows and lighting (chiaroscuro)' },
            { id: 'portraits_street', nameKey: 'themes.portraits.street', promptFragment: 'a candid street style portrait in a bustling city' },
        ]
    },
    {
        id: 'fantasy_scifi',
        nameKey: 'themes.categories.fantasyScifi',
        options: [
            { id: 'fantasy_forest', nameKey: 'themes.fantasyScifi.forest', promptFragment: 'as elves in an enchanted, magical forest' },
            { id: 'fantasy_mars', nameKey: 'themes.fantasyScifi.mars', promptFragment: 'as astronauts exploring the red landscape of Mars' },
            { id: 'fantasy_cyberpunk', nameKey: 'themes.fantasyScifi.cyberpunk', promptFragment: 'in a futuristic, neon-drenched cyberpunk city' },
            { id: 'fantasy_castle', nameKey: 'themes.fantasyScifi.castle', promptFragment: 'as royalty in a grand, medieval castle' },
            { id: 'fantasy_steampunk', nameKey: 'themes.fantasyScifi.steampunk', promptFragment: 'in a steampunk-inspired city with gears and airships' },
        ]
    },
    {
        id: 'artistic_styles',
        nameKey: 'themes.categories.artisticStyles',
        options: [
            { id: 'artistic_oil', nameKey: 'themes.artisticStyles.oil', promptFragment: 'in the style of a classical oil painting' },
            { id: 'artistic_watercolor', nameKey: 'themes.artisticStyles.watercolor', promptFragment: 'in the style of a soft, vibrant watercolor painting' },
            { id: 'artistic_comic', nameKey: 'themes.artisticStyles.comic', promptFragment: 'in a dynamic, pop-art comic book style' },
            { id: 'artistic_anime', nameKey: 'themes.artisticStyles.anime', promptFragment: 'in a beautiful, detailed anime movie style' },
        ]
    },
    {
        id: 'daily_life',
        nameKey: 'themes.categories.dailyLife',
        options: [
            { id: 'daily_cafe', nameKey: 'themes.dailyLife.cafe', promptFragment: 'in a cozy, warm cafe, drinking coffee' },
            { id: 'daily_library', nameKey: 'themes.dailyLife.library', promptFragment: 'in a quiet, grand library, surrounded by books' },
            { id: 'daily_park', nameKey: 'themes.dailyLife.park', promptFragment: 'relaxing on a park bench on a sunny day' },
            { id: 'daily_cooking', nameKey: 'themes.dailyLife.cooking', promptFragment: 'cooking together in a modern kitchen' },
        ]
    }
];

export const AI_PARTNER_TYPE_OPTIONS: { nameKey: string, value: string }[] = [
    { nameKey: 'aiPartner.partner', value: 'Partner' },
    { nameKey: 'aiPartner.husband', value: 'Husband' },
    { nameKey: 'aiPartner.wife', value: 'Wife' },
    { nameKey: 'aiPartner.boyfriend', value: 'Boyfriend' },
    { nameKey: 'aiPartner.girlfriend', value: 'Girlfriend' },
];

export const AI_CHILD_GENDER_OPTIONS: { nameKey: string, value: string }[] = [
    { nameKey: 'aiChild.son', value: 'Son' },
    { nameKey: 'aiChild.daughter', value: 'Daughter' },
];

export const ETHNICITY_OPTIONS: { nameKey: string, value: string }[] = [
    { nameKey: 'ethnicities.auto', value: 'Auto-detect' },
    { nameKey: 'ethnicities.asian', value: 'Asian' },
    { nameKey: 'ethnicities.black', value: 'Black' },
    { nameKey: 'ethnicities.caucasian', value: 'Caucasian' },
    { nameKey: 'ethnicities.hispanic', value: 'Hispanic' },
    { nameKey: 'ethnicities.khaleeji', value: 'Khaleeji (Gulf Arab)' },
    { nameKey: 'ethnicities.levantine', value: 'Levantine (East Mediterranean)' },
    { nameKey: 'ethnicities.northAfrican', value: 'North African' },
    { nameKey: 'ethnicities.persian', value: 'Persian' },
    { nameKey: 'ethnicities.turkish', value: 'Turkish' },
    { nameKey: 'ethnicities.mixed', value: 'Mixed' },
];

export const SUGGESTION_TRIGGERS: { [key: string]: string[] } = {
  'with': ['my family', 'my friends', 'my partner'],
  'at': ['the beach', 'a park', 'a wedding', 'a concert'],
  'in': ['a forest', 'the city', 'the mountains', 'a cafe'],
  'wearing': ['casual clothes', 'formal attire', 'superhero costumes', 'winter jackets'],
};