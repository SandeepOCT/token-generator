# Token Generator

This project is a token generator that generates a token and sets it as a cookie.

## Usage

To use this token generator, follow these steps:

1. Clone the repository to your local machine.
1. Install the required dependencies by running the following command:

    ```bash
    npm install
    ```

1. Change `.env-example` file name to `.env`

1. set environment variables
    ```bash
    TOKEN_URL=
    CLIENT_ID=
    CLIENT_SECRET=
    GRANT_TYPE=client_credentials
    ```

1. Run the server token generator by executing the following command:

    ```bash
    npm start
    ```

1. Then trigger request for `localhost:9998` from browser, then token will be generated and saved as cookie

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Future Scope

- auto token regeneration until server is running
- multiple token type configurations
