netcat -z ${MACHINE} 24
if [ $? -eq 0 ]
then
    echo "Telnet accepting connections"
else
    echo "Telnet connections not possible"
fi
