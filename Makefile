build: src/index.js
	npm run build

watch: build
	fswatch -o src | xargs -n1 -I{} make test

test: build
	npm test

clean:
	rm -rf dist/*

.PHONY: build watch clean test
