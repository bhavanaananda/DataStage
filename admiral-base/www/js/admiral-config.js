// ADMIRAL configuration for Javascript tools

if ( typeof admiral == "undefined " )
{
    admiral = {}
}

admiral.hostname      = "%{HOSTFULLNAME}";
admiral.databankhost  = "%{DATABANKHOST}";
admiral.databanksilo  = "%{DATABANKSILO}";
admiral.researchgroup = "%{RESEARCHGROUPNAME}";

// End.
