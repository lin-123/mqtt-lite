.PHONY: test clean

dev:
	webpack --watch

build:
	NODE_ENV=production webpack

umd:
	webpack --config example/webpack.umd.js --watch

publish: build
	npm publish