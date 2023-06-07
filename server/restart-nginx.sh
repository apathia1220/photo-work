SERVER_NAME=nginx
CID=$(docker ps | grep "$SERVER_NAME" | awk '{print $1}')
echo "开始重新启动容器$SERVER_NAME"
docker restart $CID
echo "成功重启容器$SERVER_NAME"