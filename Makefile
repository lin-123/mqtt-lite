.PHONY: test clean

dev:
	webpack --watch

build:
	NODE_ENV=production webpack

analyze:
	ANALYZE=true webpack

umd:
	webpack --config example/webpack.umd.js --watch

publish: build
	npm publish