const https = require('https');
const fs = require('fs');
const path = require('path');

// Rider-Waite card names mapping to Wikimedia Commons filenames
const cards = [
  // Major Arcana
  { name: 'The Fool', file: 'RWS_Tarot_00_Fool.jpg' },
  { name: 'The Magician', file: 'RWS_Tarot_01_Magician.jpg' },
  { name: 'The High Priestess', file: 'RWS_Tarot_02_High_Priestess.jpg' },
  { name: 'The Empress', file: 'RWS_Tarot_03_Empress.jpg' },
  { name: 'The Emperor', file: 'RWS_Tarot_04_Emperor.jpg' },
  { name: 'The Hierophant', file: 'RWS_Tarot_05_Hierophant.jpg' },
  { name: 'The Lovers', file: 'RWS_Tarot_06_Lovers.jpg' },
  { name: 'The Chariot', file: 'RWS_Tarot_07_Chariot.jpg' },
  { name: 'Strength', file: 'RWS_Tarot_08_Strength.jpg' },
  { name: 'The Hermit', file: 'RWS_Tarot_09_Hermit.jpg' },
  { name: 'Wheel of Fortune', file: 'RWS_Tarot_10_Wheel_of_Fortune.jpg' },
  { name: 'Justice', file: 'RWS_Tarot_11_Justice.jpg' },
  { name: 'The Hanged Man', file: 'RWS_Tarot_12_Hanged_Man.jpg' },
  { name: 'Death', file: 'RWS_Tarot_13_Death.jpg' },
  { name: 'Temperance', file: 'RWS_Tarot_14_Temperance.jpg' },
  { name: 'The Devil', file: 'RWS_Tarot_15_Devil.jpg' },
  { name: 'The Tower', file: 'RWS_Tarot_16_Tower.jpg' },
  { name: 'The Star', file: 'RWS_Tarot_17_Star.jpg' },
  { name: 'The Moon', file: 'RWS_Tarot_18_Moon.jpg' },
  { name: 'The Sun', file: 'RWS_Tarot_19_Sun.jpg' },
  { name: 'Judgement', file: 'RWS_Tarot_20_Judgement.jpg' },
  { name: 'The World', file: 'RWS_Tarot_21_World.jpg' },
  // Wands
  { name: 'Ace of Wands', file: 'Wands01.jpg' },
  { name: 'Two of Wands', file: 'Wands02.jpg' },
  { name: 'Three of Wands', file: 'Wands03.jpg' },
  { name: 'Four of Wands', file: 'Wands04.jpg' },
  { name: 'Five of Wands', file: 'Wands05.jpg' },
  { name: 'Six of Wands', file: 'Wands06.jpg' },
  { name: 'Seven of Wands', file: 'Wands07.jpg' },
  { name: 'Eight of Wands', file: 'Wands08.jpg' },
  { name: 'Nine of Wands', file: 'Wands09.jpg' },
  { name: 'Ten of Wands', file: 'Wands10.jpg' },
  { name: 'Page of Wands', file: 'Wands11.jpg' },
  { name: 'Knight of Wands', file: 'Wands12.jpg' },
  { name: 'Queen of Wands', file: 'Wands13.jpg' },
  { name: 'King of Wands', file: 'Wands14.jpg' },
  // Cups
  { name: 'Ace of Cups', file: 'Cups01.jpg' },
  { name: 'Two of Cups', file: 'Cups02.jpg' },
  { name: 'Three of Cups', file: 'Cups03.jpg' },
  { name: 'Four of Cups', file: 'Cups04.jpg' },
  { name: 'Five of Cups', file: 'Cups05.jpg' },
  { name: 'Six of Cups', file: 'Cups06.jpg' },
  { name: 'Seven of Cups', file: 'Cups07.jpg' },
  { name: 'Eight of Cups', file: 'Cups08.jpg' },
  { name: 'Nine of Cups', file: 'Cups09.jpg' },
  { name: 'Ten of Cups', file: 'Cups10.jpg' },
  { name: 'Page of Cups', file: 'Cups11.jpg' },
  { name: 'Knight of Cups', file: 'Cups12.jpg' },
  { name: 'Queen of Cups', file: 'Cups13.jpg' },
  { name: 'King of Cups', file: 'Cups14.jpg' },
  // Swords
  { name: 'Ace of Swords', file: 'Swords01.jpg' },
  { name: 'Two of Swords', file: 'Swords02.jpg' },
  { name: 'Three of Swords', file: 'Swords03.jpg' },
  { name: 'Four of Swords', file: 'Swords04.jpg' },
  { name: 'Five of Swords', file: 'Swords05.jpg' },
  { name: 'Six of Swords', file: 'Swords06.jpg' },
  { name: 'Seven of Swords', file: 'Swords07.jpg' },
  { name: 'Eight of Swords', file: 'Swords08.jpg' },
  { name: 'Nine of Swords', file: 'Swords09.jpg' },
  { name: 'Ten of Swords', file: 'Swords10.jpg' },
  { name: 'Page of Swords', file: 'Swords11.jpg' },
  { name: 'Knight of Swords', file: 'Swords12.jpg' },
  { name: 'Queen of Swords', file: 'Swords13.jpg' },
  { name: 'King of Swords', file: 'Swords14.jpg' },
  // Pentacles
  { name: 'Ace of Coins', file: 'Pents01.jpg' },
  { name: 'Two of Coins', file: 'Pents02.jpg' },
  { name: 'Three of Coins', file: 'Pents03.jpg' },
  { name: 'Four of Coins', file: 'Pents04.jpg' },
  { name: 'Five of Coins', file: 'Pents05.jpg' },
  { name: 'Six of Coins', file: 'Pents06.jpg' },
  { name: 'Seven of Coins', file: 'Pents07.jpg' },
  { name: 'Eight of Coins', file: 'Pents08.jpg' },
  { name: 'Nine of Coins', file: 'Pents09.jpg' },
  { name: 'Ten of Coins', file: 'Pents10.jpg' },
  { name: 'Page of Coins', file: 'Pents11.jpg' },
  { name: 'Knight of Coins', file: 'Pents12.jpg' },
  { name: 'Queen of Coins', file: 'Pents13.jpg' },
  { name: 'King of Coins', file: 'Pents14.jpg' }
];

const outputDir = path.join(__dirname, 'public', 'cards');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadCard(card, index) {
  return new Promise((resolve, reject) => {
    const url = `https://upload.wikimedia.org/wikipedia/en/thumb/d/db/${card.file}/300px-${card.file}`;
    const filename = card.name.toLowerCase().replace(/\s+/g, '-') + '.jpg';
    const filepath = path.join(outputDir, filename);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${card.name}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded ${card.name} (${index + 1}/78)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting download of 78 Rider-Waite tarot cards...\n');
  
  for (let i = 0; i < cards.length; i++) {
    try {
      await downloadCard(cards[i], i);
      // Small delay to avoid hammering the server
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`✗ Error downloading ${cards[i].name}:`, error.message);
    }
  }
  
  console.log('\nDownload complete!');
}

downloadAll();
