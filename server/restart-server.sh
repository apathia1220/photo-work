SOURCE_PATH=/usr/local/mihoyo/docker
SERVER_NAME=photo_server
SERVER_PORT=3001
CID=$(docker ps | grep "$SERVER_NAME" | awk '{print $1}')
IID=$(docker images | grep "$SERVER_NAME" | awk '{print $3}')
if [ -n "$CID" ]; then
  echo "存在容器$SERVER_NAME,CID-$CID"
  docker stop $CID
  echo "成功停止容器$SERVER_NAME,CID-$CID"
  docker rm $CID
  echo "成功删除容器$SERVER_NAME,CID-$CID"
fi
if [ -n "$IID" ]; then
  echo "存在镜像$SERVER_NAME,IID=$IID"
  docker rmi $IID
  echo "成功删除镜像$SERVER_NAME,IID=$IID"
fi
echo "开始构建镜像$SERVER_NAME"
cd $SOURCE_PATH
docker build -t $SERVER_NAME .
echo "成功构建镜像$SERVER_NAME"
docker run --restart=always -p 3001:3001 -d --name photo_server photo_server
echo "成功创建并运行容器$SERVER_NAME"