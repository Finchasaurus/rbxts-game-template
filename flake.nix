{
  description = "rbxts-game-template";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        rojo = pkgs.rustPlatform.buildRustPackage rec {
          pname = "rojo";
          version = "7.7.0";

          src = pkgs.fetchFromGitHub {
            owner = "rojo-rbx";
            repo = "rojo";
            tag = "v${version}";
            hash = "sha256-2atNAiv51MNpxXdwvKSvtO1CGvQUOdUUOZszjAm3zi8=";
            fetchSubmodules = true;
          };

          cargoHash = "sha256-1xTvW3Ra6erYpjxgfp2m8qVMz6u99WCDv2VE/Xh2mFc=";

          nativeBuildInputs = [
            pkgs.pkg-config
          ];

          buildInputs = [
            pkgs.openssl
          ];

          OPENSSL_NO_VENDOR = true;

          doCheck = !pkgs.stdenv.hostPlatform.isDarwin;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            rojo
            pkgs.nodejs
            pkgs.git
          ];
        };
      });
}
