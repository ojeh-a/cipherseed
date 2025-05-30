// contracts/src/validator.ak
use aiken/transaction.{find_input, ScriptContext, Transaction}
use aiken/hash.{Blake2b_224, Hash}

type Datum {
  owner: Hash<Blake2b_224>,
  stake: Int
}

validator {
  /// Validate spending of staked funds
  fn spend(datum: Datum, _redeemer: (), ctx: ScriptContext) -> Bool {
    // 1. Verify transaction is signed by the owner
    let is_signed = list.any(
      ctx.transaction.extra_signatories,
      fn(sig) { sig == datum.owner }
    )
    
    // 2. Verify the correct UTXO is being spent
    let owns_utxo = 
      ctx.transaction.inputs
      |> find_input(ctx.purpose.get_spent_output_reference())
      |> fn(maybe_input) {
        when maybe_input is {
          None -> False
          Some(input) -> input.output.datum == DatumHash(Data.from(datum))
        }
      }
    
    is_signed && owns_utxo
  }
}