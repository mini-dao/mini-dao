CREATE TABLE IF NOT EXISTS "wallet_holdings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"chain_id" integer NOT NULL,
	"address" text NOT NULL,
	"amount" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_holdings_wallet_id_chain_id_address_unique" UNIQUE("wallet_id","chain_id","address")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallet_holdings" ADD CONSTRAINT "wallet_holdings_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
