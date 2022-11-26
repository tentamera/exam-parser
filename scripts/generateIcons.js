import { promises } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const sizes = [16, 24, 32, 48, 128];

async function main() {
	const base = dirname(fileURLToPath(import.meta.url));
	const svg = await promises.readFile(join(base, '../src/icon.svg'));

	for (const size of sizes) {
		const resvg = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: size,
			},
		});
		const pngData = resvg.render();
		const pngBuffer = pngData.asPng();

		const path = join(base, `../dist/icon${size}.png`);
		// eslint-disable-next-line no-await-in-loop
		await promises.writeFile(path, pngBuffer);
	}
}

main();
