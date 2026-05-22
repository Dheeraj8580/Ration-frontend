const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\Varun\\.gemini\\antigravity\\brain\\27b4fb32-120c-44be-a176-151a5c29aa95';
const destDir = path.join(__dirname, 'public');

const images = [
  'about_hero_digital_ration_1776852941982.png',
  'mission_vision_concept_1776852964143.png',
  'how_it_works_process_1776852988745.png',
  'home_hero_ration_card_1776853065995.png',
  'dashboard_welcome_illustration_1776853100310.png',
  'admin_stats_illustration_1776853139834.png'
];

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

images.forEach(img => {
  const src = path.join(sourceDir, img);
  const dest = path.join(destDir, img);
  try {
    fs.copyFileSync(src, dest);
    console.log(`Successfully copied ${img}`);
  } catch (err) {
    console.error(`Failed to copy ${img}:`, err.message);
  }
});
