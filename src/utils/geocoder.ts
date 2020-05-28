import nodeGeocoder from 'node-geocoder';

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'DdeMjh3acPYJv255xYJAE3dsR4Gadx6f',
    formatter: null
}

// @ts-ignore: Unreachable code error
export const geocoder = nodeGeocoder(options);