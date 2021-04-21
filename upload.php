<?php
# 檢查檔案是否上傳成功
if ($_FILES['my_file']['error'] === UPLOAD_ERR_OK){
  echo '檔案名稱: ' . $_FILES['my_file']['name'] . '<br/>';
  echo '檔案類型: ' . $_FILES['my_file']['type'] . '<br/>';
  echo '檔案大小: ' . ($_FILES['my_file']['size'] / 1024) . ' KB<br/>';
  echo '暫存名稱: ' . $_FILES['my_file']['tmp_name'] . '<br/>';

  $dest='upload/music.mp3';
  $file = $_FILES['my_file']['tmp_name'];

  # 檢查檔案是否已經存在
  if (file_exists($dest)){
    echo '檔案已存在。<br/>';
    unlink($dest);
    move_uploaded_file($file, $dest);
  } else {
    # 將檔案移至指定位置
    move_uploaded_file($file, $dest);
  }
} else {
  echo '錯誤代碼：' . $_FILES['my_file']['error'] . '<br/>';
}
header("Location: home.html");
?>