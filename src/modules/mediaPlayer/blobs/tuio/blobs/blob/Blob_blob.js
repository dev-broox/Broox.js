function Blob_blob(id, classId = ""){
    this.id = id;
    this.classId = classId;

    this.update = (data) => {
        this.width = data.width ? data.width : 0;
        this.height = data.height ? data.height : 0;
        this.rotation = data.rotation ? data.rotation : 0;
        this.timeAlive = data.timeAlive ? data.timeAlive : 0;

        if(!data.velocityX && !data.velocityY && this.x && this.y && data.x && data.y){
            this.velocityX = data.x - this.x;
            this.velocityY = data.y - this.y;
        }
        else{
            this.velocityX = data.velocityX ? data.velocityX : 0;
            this.velocityY = data.velocityY ? data.velocityY : 0;
        }

        this.x = data.x;
        this.y = data.y;
    }
}

export default Blob_blob;