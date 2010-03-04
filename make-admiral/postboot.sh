while [ ! -f firstboot_done]
do echo First boot not finished, waiting ... 
sleep 10 
done

echo ===============================
echo Installing and configuring LDAP
echo ===============================
./ldapsetup.sh
echo '==============================='
echo 'Installing and configuring HFS'
echo '==============================='
./hfssetup.sh
