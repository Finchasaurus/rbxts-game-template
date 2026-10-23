{
  description = "rbxts-game-template";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        lib = pkgs.lib;

        mkRustPackage =
          {
            pname,
            version,
            owner,
            repo,
            hash,
            cargoHash,
            doCheck ? true,
            fetchSubmodules ? false,
          }:
          pkgs.rustPlatform.buildRustPackage {
            inherit
              pname
              version
              cargoHash
              doCheck
              ;
            src = pkgs.fetchFromGitHub {
              inherit
                owner
                repo
                hash
                fetchSubmodules
                ;
              tag = "v${version}";
            };
          };

        rojo = mkRustPackage {
          pname = "rojo";
          version = "7.7.1";
          owner = "rojo-rbx";
          repo = "rojo";
          hash = "sha256-wN+pi/My1aEfTKGhEPJljsRC/gzVkUSiA9aLWZslz1Q=";
          cargoHash = "sha256-zp30mMv5n43iPccIx+oSP/T/za3mLP4+Nr4ZyQQnxbk=";
          fetchSubmodules = true;
        };

        asphalt = mkRustPackage {
          pname = "asphalt";
          version = "2.0.2";
          owner = "jackTabsCode";
          repo = "asphalt";
          hash = "sha256-1SYRjKPYkQaCntsKiiMg0v4kzxnQ6Pns6fk5cO1ImVA=";
          cargoHash = "sha256-R4pNHy/4BmmbKzuYWM31Iih626AL46lLe1BY3d57FZI=";
          doCheck = false;
        };

        runtimeLibraries = with pkgs; [
          glib
          libX11
          libxcb
          libXcomposite
          libXcursor
          libXdamage
          libXext
          libXfixes
          libXi
          libXrender
          libXtst
          libXScrnSaver
          libXrandr
          nss
          nspr
          atk
          at-spi2-atk
          at-spi2-core
          dbus
          gdk-pixbuf
          gtk3
          pango
          cairo
          expat
          libdrm
          mesa
          alsa-lib
          cups
        ];
      in
      {
        packages = {
          inherit rojo asphalt;
          default = rojo;
        };

        devShells.default = pkgs.mkShell {
          ESLINT_USE_FLAT_CONFIG = "false";

          packages = with pkgs; [
            rojo
            asphalt

            nodejs_22
            git
            luau-lsp
            ripgrep
          ];

          LD_LIBRARY_PATH = lib.makeLibraryPath runtimeLibraries;
        };
      }
    );
}
