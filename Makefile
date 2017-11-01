.PHONY: test clean


dev:
	webpack --watch

build:
	NODE_ENV=production webpack

test:
	webpack --config test/webpack.test.js --watch

publish: build
	npm publish