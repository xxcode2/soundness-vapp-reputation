const hre = require("hardhat");

async function main() {
  const Badge = await hre.ethers.getContractFactory("SoundnessBadge");
  const badge = await Badge.deploy();

  // ethers v6 style:
  await badge.waitForDeployment();

  // address helper (works across plugin versions)
  const addr = badge.getAddress ? await badge.getAddress() : badge.target;

  console.log("SoundnessBadge deployed to:", addr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

