#!/usr/bin/env node
/**
 * Generate app icons from SVG favicon
 *
 * Uses the astacinco brand favicon with tier-based color variants:
 * - Free tier: Cyan (#00d4ff) - original brand color
 * - Pro tier: Gold (#F59E0B) - premium tools
 *
 * Usage: npm run generate-icons
 */

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Source SVG path - update if favicon location changes
// Path: workspace/react-native/rn-toolkit -> workspace/sites/astacinco
const svgPath = join(rootDir, '..', '..', 'sites', 'astacinco', 'favicon.svg');

// Tier-based color system
const TIER_COLORS = {
  free: '#00d4ff',  // Cyan - original brand color
  pro: '#F59E0B',   // Gold - premium tools
};

// App configurations
const APP_CONFIG = {
  'showcase': { tier: 'free', splashBg: '#07090d' },
  'challenge-hub': { tier: 'free', splashBg: '#07090d' },
  'assessment-practice': { tier: 'free', splashBg: '#07090d' },
  // Future pro tools would use: tier: 'pro'
};

// Icon sizes required by Expo
const ICON_SIZES = {
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'favicon.png': 64,
};

// Splash screen dimensions (iPhone 14 Pro Max)
const SPLASH_WIDTH = 1284;
const SPLASH_HEIGHT = 2778;

function generateSvgWithColor(svg, newColor) {
  return svg.replace(/#00d4ff/g, newColor);
}

function renderSvgToPng(svg, size) {
  const scaledSvg = svg.replace(
    'viewBox="0 0 64 64"',
    `viewBox="0 0 64 64" width="${size}" height="${size}"`
  );

  const resvg = new Resvg(scaledSvg, {
    fitTo: { mode: 'width', value: size },
  });

  return resvg.render().asPng();
}

function generateSplash(svg, bgColor) {
  const iconSize = Math.min(SPLASH_WIDTH, SPLASH_HEIGHT) * 0.25;
  const x = (SPLASH_WIDTH - iconSize) / 2;
  const y = (SPLASH_HEIGHT - iconSize) / 2;

  const innerSvg = svg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '');

  const splashSvg = `
    <svg width="${SPLASH_WIDTH}" height="${SPLASH_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${SPLASH_WIDTH}" height="${SPLASH_HEIGHT}" fill="${bgColor}"/>
      <g transform="translate(${x}, ${y})">
        <svg viewBox="0 0 64 64" width="${iconSize}" height="${iconSize}">
          ${innerSvg}
        </svg>
      </g>
    </svg>
  `;

  const resvg = new Resvg(splashSvg);
  return resvg.render().asPng();
}

function main() {
  // Check if source SVG exists
  if (!existsSync(svgPath)) {
    console.error(`❌ Source SVG not found: ${svgPath}`);
    console.error('   Make sure the astacinco site is at ../sites/astacinco/');
    process.exit(1);
  }

  const svgContent = readFileSync(svgPath, 'utf8');

  console.log('🎨 Generating app icons...\n');
  console.log('Tier colors:');
  console.log(`  Free: ${TIER_COLORS.free} (cyan)`);
  console.log(`  Pro:  ${TIER_COLORS.pro} (gold)\n`);

  for (const [app, config] of Object.entries(APP_CONFIG)) {
    const assetsDir = join(rootDir, 'apps', app, 'assets');
    const color = TIER_COLORS[config.tier];

    // Ensure assets directory exists
    if (!existsSync(assetsDir)) {
      mkdirSync(assetsDir, { recursive: true });
    }

    const coloredSvg = generateSvgWithColor(svgContent, color);

    console.log(`📱 ${app} [${config.tier}]`);

    // Generate each icon size
    for (const [filename, size] of Object.entries(ICON_SIZES)) {
      const pngBuffer = renderSvgToPng(coloredSvg, size);
      writeFileSync(join(assetsDir, filename), pngBuffer);
      console.log(`   ✓ ${filename} (${size}x${size})`);
    }

    // Generate splash screen
    const splashBuffer = generateSplash(coloredSvg, config.splashBg);
    writeFileSync(join(assetsDir, 'splash.png'), splashBuffer);
    console.log(`   ✓ splash.png (${SPLASH_WIDTH}x${SPLASH_HEIGHT})`);

    // Clean up old SolarRacer icon if it exists
    const oldIcon = join(assetsDir, 'SolarRacerAppIcon1024.png');
    if (existsSync(oldIcon)) {
      unlinkSync(oldIcon);
      console.log(`   🗑️  Removed old SolarRacerAppIcon1024.png`);
    }

    console.log('');
  }

  console.log('✅ Done! Icons generated for all apps.');
}

main();
