#!/bin/bash
echo "Adding MongoDB to PATH..."
export PATH="/c/Program Files/MongoDB/Server/8.2/bin:$PATH"
echo "MongoDB added to PATH"
echo "Testing MongoDB commands..."
mongod --version
mongosh --version
echo ""
echo "MongoDB is now available in this session"
echo "To make this permanent, add C:\Program Files\MongoDB\Server\8.2\bin to your system PATH environment variables"
exec bash