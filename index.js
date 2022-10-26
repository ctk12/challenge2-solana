// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array([
  165, 112, 132, 158, 47, 124, 136, 235, 227, 30, 182, 143, 178, 50, 92, 155,
  218, 10, 144, 114, 120, 246, 136, 145, 248, 143, 53, 30, 9, 232, 57, 222, 172,
  63, 207, 23, 192, 201, 217, 138, 50, 61, 114, 53, 218, 241, 36, 247, 160, 217,
  100, 157, 24, 163, 54, 40, 243, 238, 36, 178, 62, 204, 153, 116,
]);

const transferSol = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Get Keypair from Secret Key
  var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
  // Aidrop 2 SOL to Sender wallet
  // console.log("Airdopping some SOL to Sender wallet!");
  // const fromAirDropSignature =
  // await connection.requestAirdrop(
  //   new PublicKey(from.publicKey),
  //   2 * LAMPORTS_PER_SOL
  // );

  const walletBalance = await connection.getBalance(
    new PublicKey(from.publicKey)
  );
  const sendBalance = Math.round(walletBalance / 2);
  // Other things to try:
  // 1) Form array from userSecretKey
  // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
  // 2) Make a new Keypair (starts with 0 SOL)
  // const from = Keypair.generate();

  // Generate another Keypair (account we'll be sending to)
  const to = Keypair.generate();

  // Send money from "from" wallet and into "to" wallet
  var transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: sendBalance,
    })
  );

  // Sign transaction
  var signature = await sendAndConfirmTransaction(connection, transaction, [
    from,
  ]);
  const walletafterBalance = await connection.getBalance(
    new PublicKey(from.publicKey)
  );

  console.log(
    `Before Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
  );
  console.log("Signature is ", signature);
  console.log(
    `After Wallet balance: ${
      parseInt(walletafterBalance) / LAMPORTS_PER_SOL
    } SOL`
  );
  console.log(
    `Sent ${parseInt(sendBalance) / LAMPORTS_PER_SOL} SOL to address ${
      to.publicKey
    }`
  );
};

transferSol();
