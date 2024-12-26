---
id: no-custody-risk
---

# No custody risk

Custody risk is a persistent challenge in interoperability and more so for Bitcoin. Whether centralized or decentralized, most existing bridges and exchanges expose users to vulnerabilities by requiring funds to be locked, or temporarily held by third parties (custodians, networks). The risks of custody loss are very real and well documented:

- **Centralized custody**: Hacks like the $600M Ronin Bridge exploit or exchange collapses (e.g., Mt. Gox, FTX) highlight the catastrophic risks of entrusting funds to third parties.

- **Decentralized custody**: Even decentralized solutions relying on Multi-Party Computation (MPC) or liquidity pools aren’t immune, as seen with the Nomad Bridge (&dollar;190M hack) or smart contract bugs in Wormhole (&dollar;325M hack).

It’s clear that even “self-custody” solutions involving shared smart contracts or MPC nodes come with significant risks.

Garden eliminates custody risks entirely by enabling peer-to-peer atomic swaps, ensuring users retain full control of their assets throughout the process.

## How Garden eliminates custody risks

Garden takes a fundamentally different approach by enabling peer-to-peer atomic swaps. This ensures users retain full control of their assets throughout the process. Here’s how user custody is maintained at every step of the intent flow:

**Intent creation**:User intents are cryptographically signed and broadcasted without transferring custody. No funds leave the user’s wallet until a solver is matched.

**Solver auction**:No custody risk arises here, as funds are not involved during the solver selection process.

**Settlement**:After a solver is selected, the user locks their funds in a Hashed Timelock Contract (HTLC) on the source chain. HTLCs enforce conditional asset transfers using cryptographic hashes and timelocks. This ensures:

- Funds can only be claimed by the rightful owner when swap conditions are met.
- Funds are automatically refunded to the user if the timelock expires without settlement.

**Redemption**:The user redeems their funds on the destination chain using a cryptographic secret. This guarantees:

- The solver can only claim funds on the source chain after fulfilling their obligations on the destination chain.
- Simultaneous execution prevents custody transfer to intermediaries at any point.

For more technical details, see [atomic swaps](../introduction/AtomicSwaps.mdx) and [intent flow](../how-it-works/IntentFlow.md).

Garden’s peer-to-peer architecture, cryptographic guarantees, and avoidance of custodial models set a new standard for secure and trustless swaps. By removing the need for intermediaries and ensuring full user control, Garden redefines what true ownership and trustlessness mean in cross-chain interoperability.