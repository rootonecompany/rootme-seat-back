module.exports = {
    apps: [
        {
            name: "seat-rootme-back",
            script: "npm",
            args: "run start:dev",
            instance: 1,
            watch: true,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
