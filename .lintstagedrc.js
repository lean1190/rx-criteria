const config = {
    '*.ts': ['npm run types:check'],
    '*.{ts,js}': [() => 'npm run lint:fix']
};

export default config;
