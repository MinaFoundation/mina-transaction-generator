{
  description = "Transaction generator for Mina networks.";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
          nodejs = pkgs.nodejs_18;
          yarn' = pkgs.yarn.override { inherit nodejs; };
        in
        {
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              nodejs
              yarn'
              python3
              pkg-config
              openssl
            ];
          };
        }
      );
}
