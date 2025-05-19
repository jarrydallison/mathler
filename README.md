# Welcome to Mathler Redux!

I built this little game using [mathler](https://www.mathler.com/) as a fun project. TO make it more interesting, this version is wrapped in the [dynamic](dynamic.xyz) SDK, allowing for login, game tracking, and purchasing hints! Note that I only used megaETH testnet tokens, and also enabled a custom onramp to make it as easy as possible for the user.

## Game overview

Find a 6-character math equation that equals the function value. The largest number is 3 digits. You may use one or more of the following operators: +, -, \*, and /. After an answer is submitted, the color of the tiles indicates whether the numbers and operators are correct. Green tiles are the correct character in the correct position. Yellow tiles are the correct character in the wrong position. White tiles are wholly incorrect. You have 6 guesses, and numbers and operators can be used multiple times. Good luck!

## Crypto-specific

Part of the build was designed to do something crypto related. I decided to allow users to be able to purchase hints, using megaETH's testnet token. I also enabled Dynamic's custom onRamp to pop up megaETH's faucet, enabling a user to immediately get more tokens and purchase hints. I know, I know, I'm a nice guy.

## Testing

The test coverage is decent but will be updated in the coming days. Tests cover the core functionality most crucial to the application game play, including function generation, function evaluation, and tile color scheme, among a few others.

## Build overview

Dynamic has multiple docs and starter kits for frameworks like react and next, but I wanted to build this in react router v7 as an additional exercise. This uses react-router v7 SSR. To deploy this application, I chose fly.io, as it was an early supporter of react-router v7 applications.

### Installation

To run locally:

1. Install the dependencies:

```bash
yarn install
```

2. Start the development server with HMR:

```bash
yarn dev
```

3. Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
yarn build
```
