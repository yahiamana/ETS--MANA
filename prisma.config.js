const fs = require('fs');
const path = require('path');

// Simple .env parser to ensure DATABASE_URL is available
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
            process.env[key.trim()] = value;
        }
    });
}

module.exports = {
    datasource: {
        url: process.env.DATABASE_URL
    }
}
