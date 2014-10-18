var timeout;

//bind all click events on all navigation links
window.onload = function()
{
    var level         = "";
    var lines         = "";
    var group         = "";
    var domain        = "";
    var domain_link   = "";
    var category      = "";
    var category_link = "";
    var service       = "";
    var service_link  = "";

    var servers = document.getElementById("navigation-servers");

    //get the root groups and loop them
    var list_items = servers.getElementsByTagName("li");
    for (var i = 0; i < list_items.length; i++)
    {
        if (list_items[i].hasAttribute("level"))
        {
            level = list_items[i].getAttribute("level");
            switch (level)
            {
                case "group":
                    lines = list_items[i].innerHTML.split("\n");
                    group = lines[1].replace(/^\s+|\s+$/g,"");
                    break;
                case "domain":
                    domain_link = list_items[i].children[0];
                    domain = domain_link.innerHTML;
                    (
                        function(_group, _domain)
                        {
                            domain_link.onclick = function()
                            {
                                return toggle_domain(_group, _domain);
                            };
                        }(group, domain)
                    );
                    break;
                case "category":
                    category_link = list_items[i].children[0];
                    category = category_link.innerHTML;
                    (
                        function(_group, _domain, _category)
                        {
                            category_link.onclick = function()
                            {
                                return toggle_category(_group, _domain, _category);
                            };
                        }(group, domain, category)
                    );
                    break;
                case "service":
                    service_link = list_items[i].children[0];
                    service = service_link.innerHTML;
                    (
                        function(_group, _domain, _category, _service)
                        {
                            service_link.onclick = function()
                            {
                                return load_service(_group, _domain, _category, _service);
                            };
                        }(group, domain, category, service)
                    );
                    break;
            }
        }
    }

    document.getElementById("problems").onclick = load_problems;

    load_problems();
};

function load_problems()
{
    clearTimeout(timeout);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("main").innerHTML = xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", "/problems.html", true);
    xmlhttp.send();

    timeout = setTimeout(load_problems, 300000);

    return false;
}

function toggle_domain(_group, _domain)
{
    toggle_list_items(_group, _domain, "", "domain");

    return false;
}

function toggle_category(_group, _domain, _category)
{
    toggle_list_items(_group, _domain, _category, "category");

   return false;
}

function load_service(_group, _domain, _category, _service)
{
    clear_bold();

    var service_url = get_service_link(_group, _domain, _category, _service);
    service_url.style.fontWeight = "bold";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("main").innerHTML = xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", service_url.href, true);
    xmlhttp.send();

    clearTimeout(timeout);
    timeout = setTimeout(function(){load_service(_group, _domain, _category, _service);}, 300000);

    return false;
}

function toggle_list_items(_group, _domain, _category, _level)
{
    var level         = "";
    var lines         = "";
    var group         = "";
    var domain        = "";
    var category      = "";

    var servers = document.getElementById("navigation-servers");

    //get the root groups and loop them
    var list_items = servers.getElementsByTagName("li");
    for (var i = 0; i < list_items.length; i++)
    {
        if (list_items[i].hasAttribute("level"))
        {
            level = list_items[i].getAttribute("level");
            switch (level)
            {
                case "group":
                    lines = list_items[i].innerHTML.split("\n");
                    group = lines[1].replace(/^\s+|\s+$/g,"");
                    break;
                case "domain":
                    domain = list_items[i].children[0].innerHTML;
                    break;
                case "category":
                    category = list_items[i].children[0].innerHTML;
                    if (_level == "domain")
                    {
                        if (_group == group && _domain == domain)
                        {
                            if (list_items[i].style.display != "block")
                            {
                                list_items[i].style.display = "block";
                            }
                            else
                            {
                                list_items[i].style.display = "none";
                            }
                        }
                    }
                    break;
                case "service":
                    if (_level == "category")
                    {
                        if (_group == group && _domain == domain && _category == category)
                        {
                            if (list_items[i].style.display != "block")
                            {
                                list_items[i].style.display = "block";
                            }
                            else
                            {
                                list_items[i].style.display = "none";
                            }
                        }
                    }
                    break;
            }
        }
    }
}

function clear_bold()
{
    var level = "";

    var servers = document.getElementById("navigation-servers");

    //get the root groups and loop them
    var list_items = servers.getElementsByTagName("li");
    for (var i = 0; i < list_items.length; i++)
    {
        if (list_items[i].hasAttribute("level"))
        {
            if (list_items[i].getAttribute("level") == "service")
            {
                list_items[i].children[0].style.fontWeight = "normal";
            }
        }
    }
}

function get_service_link(_group, _domain, _category, _service)
{
    var level        = "";
    var lines        = "";
    var group        = "";
    var domain       = "";
    var category     = "";
    var service      = "";
    var service_link = "";

    var servers = document.getElementById("navigation-servers");

    //get the root groups and loop them
    var list_items = servers.getElementsByTagName("li");
    for (var i = 0; i < list_items.length; i++)
    {
        if (list_items[i].hasAttribute("level"))
        {
            level = list_items[i].getAttribute("level");
            switch (level)
            {
                case "group":
                    lines = list_items[i].innerHTML.split("\n");
                    group = lines[1].replace(/^\s+|\s+$/g,"");
                    break;
                case "domain":
                    domain = list_items[i].children[0].innerHTML;
                    break;
                case "category":
                    category = list_items[i].children[0].innerHTML;
                    break;
                case "service":
                    service_link = list_items[i].children[0];
                    service = service_link.innerHTML;
                    if (_group == group && _domain == domain && category == _category && _service == service)
                    {
                        return service_link;
                    }
                    break;
            }
        }
    }
}
