const fs = require("fs");

async function fetchColor() {
  try {
    // Fetch color from the API endpoint
    const response = await fetch(
      `https://sellingPrice-in-kenya-server-3.onrender.com/settings`
    );

    // Check if the response is ok (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const color = data.bgColor || "#ab4725"; // Fallback color

    // Load the Tailwind config file
    const configPath = "./tailwind.config.ts";
    let config = fs.readFileSync(configPath, "utf8");

    // Replace the color in the config file
    config = config.replace(/main:\s*['"].*['"]/, `main: '${color}'`);

    // Save the updated config file
    fs.writeFileSync(configPath, config, "utf8");
  } catch (error) {
    console.error("Failed to fetch the color:", error);
  }
}

fetchColor();
