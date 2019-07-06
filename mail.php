<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load composer's autoloader
require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->CharSet = 'UTF-8';
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com"
    $mail->SMTPAuth = true;
    $mail->Username = 'info@nutree.gr';
    $mail->Password = 'Nutree2018';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    //Recipients
    $mail->setFrom($_POST['email'], $_POST['name']);
    $mail->addAddress('info@nutree.gr', 'nutree.gr');

    //Content
    $mail->isHTML(true);
    $mail->Subject = 'nutree.gr - Φόρμα επικοινωνίας';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->msgHTML('Email: '.$_POST['email'].' <br><br> '.'Name: '.$_POST['phone'].' <br><br> '.'Name: '.$_POST['name'].' <br><br> '.'Message: '.$_POST['message']);

    if ($mail->Send()) {
        header("Location:contact.html");
    }

} catch (Exception $e) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
}
