@echo off
set srcFile=E:\Working\Websites\DPSFE\assets\config\copies\dpstest2.json
set destFile=E:\Working\Websites\DPSFE\assets\config\production.json

set srcFile2=E:\Working\Websites\DPSFE\assets\config\copies\vt-test.json
set destFile2=E:\Working\Websites\DPSFE-VT\assets\config\production.json

set srcFile3=E:\Working\Websites\DPSFE\assets\config\copies\dpsdemo.json
set destFile3=E:\Working\Websites\DPS-Demo\FE\assets\config\production.json

if not exist "%srcFile%" (
    echo %srcFile% does not exist.
    goto :EOF
)

if not exist "%destFile%" (
    echo %destFile% does not exist.
    goto :EOF
)

if not exist "%destFile%\.." (
    echo The directory for %destFile% does not exist.
    goto :EOF
)

break > "%destFile%"
type "%srcFile%" >> "%destFile%"

if not exist "%srcFile2%" (
    echo %srcFile2% does not exist.
    goto :EOF
)

if not exist "%destFile2%" (
    echo %destFile2% does not exist.
    goto :EOF
)

if not exist "%destFile2%\.." (
    echo The directory for %destFile2% does not exist.
    goto :EOF
)

break > "%destFile2%"
type "%srcFile2%" >> "%destFile2%"

if not exist "%srcFile3%" (
    echo %srcFile3% does not exist.
    goto :EOF
)

if not exist "%destFile3%" (
    echo %destFile3% does not exist.
    goto :EOF
)

if not exist "%destFile3%\.." (
    echo The directory for %destFile3% does not exist.
    goto :EOF
)

break > "%destFile3%"
type "%srcFile3%" >> "%destFile3%"
