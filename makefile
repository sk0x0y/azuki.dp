proto:
	protoc \
		-I=src/core/interface/proto/schema \
		--ts_out=src/core/interface/proto/build \
		src/core/interface/proto/schema/*.proto

#--js_out=library=validation,binary:src/infrastructure/driven-adapters/providers/protobuf/dp/build \
# https://github.com/grpc/grpc-node/issues/1405
m1env:
	-npm remove grpc-tools
	npm install grpc-tools --ignore-scripts
	pushd node_modules/grpc-tools
	node_modules/.bin/node-pre-gyp install --target_arch=x64
	popd

install:
	#-brew install protoc protoc-gen-grpc
	-npm install protoc-gen-ts
	-npm install google-protobuf
