const hre = require("hardhat");

async function main() {
  const Badge = await hre.ethers.getContractFactory("SoundnessBadge");
  const badge = await Badge.deploy();
  await badge.deployed();
  console.log("SoundnessBadge deployed to:", badge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
