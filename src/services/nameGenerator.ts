// Cute squishy name generator based on combination traits

interface NameTraits {
  shapeName: string;
  colorName: string;
  faceStyle: string;
  accessoryName?: string;
  scentName: string;
}

export function generateSquishyName(traits: NameTraits): string {
  const { shapeName, colorName, faceStyle, accessoryName, scentName } = traits;

  const colorPrefix = colorName.replace(' Green', '').replace(' Pink', '').replace(' White', '').replace(' Brown', '').replace(' Blue', '').replace(' Yellow', '');

  // Cute style words
  const moodAdjectives: Record<string, string[]> = {
    happy: ['Joyful', 'Cheerful', 'Smiling', 'Sunny'],
    shy: ['Sweet', 'Timid', 'Petite', 'Blushy'],
    sleepy: ['Dreamy', 'Drowsy', 'Sleepy', 'Cozy'],
    excited: ['Bubbly', 'Bouncy', 'Sparkly', 'Zippy'],
    blushing: ['Rosy', 'Fluffy', 'Peachy', 'Lovely'],
    cool: ['Chill', 'Snazzy', 'Dapper', 'Groovy'],
    yummy: ['Tasty', 'Mochi', 'Sugar', 'Honey'],
    love: ['Darling', 'Angel', 'Beloved', 'Charmed'],
    tiny: ['Mini', 'Lil', 'Pocket', 'Button'],
    uwu: ['UwU', 'Kawaii', 'Pure', 'Soft'],
  };

  const moods = moodAdjectives[faceStyle] || ['Cozy', 'Sweet'];
  const pickedMood = moods[Math.floor(Math.random() * moods.length)];

  // Various cute name structure patterns
  const patterns = [
    `${colorPrefix} ${shapeName}`,
    `${pickedMood} ${colorPrefix} ${shapeName}`,
    `${colorPrefix} Mochi ${shapeName}`,
    `${scentName} ${shapeName}`,
  ];

  if (accessoryName) {
    patterns.push(`${accessoryName.replace('Hat', '').replace('Clip', '').trim()} ${shapeName}`);
  }

  const generated = patterns[Math.floor(Math.random() * patterns.length)].trim();
  // Ensure maximum 24 characters as specified in prompt
  return generated.length > 24 ? generated.slice(0, 24) : generated;
}
