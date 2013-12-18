builder.selenium2.io.addLangFormatter({
    name : "Perl - WebDriver",
    extension : ".t",
    not : "! ",
    start : "#!perl\n\nuse strict;\nuse warnings;\nuse Test::More;\nuse Selenium::Remote::Driver;\n\nmy $wd = Selenium::Remote::Driver->new();\n" +
            "sub get_cookie{\n"+
            "   my (@cookies, $name) = @_;\n" +
            "   my %cookie;\n" +
            "   foreach (@array) {" +
            "       if ($_->{name} ex $name) {\n" +
            "           %cookie = $_;\n" +
            "           last;\n" +
            "       }\n" +
            "    }\n" +
            "    return %cookie;\n" +
            "}",
    end : "\ndone_testing();\n",
    lineForType : {
        "get" : "ok( $wd->get({url}) );\n",
        "goBack" : "ok( $wd->go_back() );\n",
        "goForward" : "ok( $wd->go_forward() );\n",
        "refresh" : "ok( $wd->refresh() );\n",
        'clickElement' : "ok( $wd->find_element({locator}, {locatorBy})->click() );\n",
        "mouseOverElement":
            "ok( $wd->find_element({locator}, {locatorBy})->hover() );\n",
        "setElementText":
            "my $el = $wd->find_element({locator}, {locatorBy});\n" +
            "ok( $el->click() );\n" +
            "ok( $el->clear() );\n" +
            "ok( $el->send_keys({text}) );\n",
        "sendKeysToElement":
            "my $el = $wd->find_element({locator}, {locatorBy});\n" +
            "ok( $el->click() );\n" +
            "ok( $el->send_keys({text}) );\n",
        "setElementSelected":
            "my $el = $wd->find_element({locator}, {locatorBy});\n" +
            "if(! $el->is_selected()) {\nok( $el->click() );\n}",
        "setElementNotSelected":
            "my $el = $wd->find_element({locator}, {locatorBy});\n" +
            "if($el->is_selected()) {\nok( $el->click() );\n}",
        "submitElement":
            "ok( $wd->find_element({locator}, {locatorBy})->submit() );\n",
        "addCookie":
            function(step, escapeValue, userParams, doSubs) {
                var name = escapeValue(step.type, step.name),
                    value = escapeValue(step.type, step.value),
                    path = "/",
                    domain = "",
                    secure = 0;

                var opts = step.options.split(",");
                for (var i = 0; i < opts.length; i++) {
                  var kv = opts[i].trim().split("=");
                  if (kv.length == 1) { continue; }
                  if (kv[0] == "path") {
                    path = escapeValue(step.type, kv[1])
                  }
                return "ok ($wd->add_cookie('" + name + "', '" + value + "', '" + path + "', '" + domain + "', 0) );\n";
            },
        "deleteCookie": "ok( $wd->delete_cookie_named({name}) );\n",
        "switchToFrame": "(ok $wd->switch_to_frame({identifier}) );\n",
        "switchToFrameByIndex": "(ok $wd->switch_to_frame({index}) );\n",
        "switchToWindow": "(ok $wd->switch_to_window({name}) );\n",
        "switchToDefaultContent": "(ok $wd->switch_to_frame(NULL) );\n",
        "answerAlert": "ok( $wd->send_keys_to_alert({text}) );\n" +
                        "ok( $wd->accept_alert );\n",
        "acceptAlert": "ok( $wd->accept_alert );\n",
        "dismissAlert": "ok( $wd->dismiss_alert );\n",
        "saveScreenshot" = "ok( $wd->screenshot() );\n",
        "print": "print {text};\n",
        "store": "${variable} = {text};\n"
    },
    locatorByForType : function (stepType, locatorType, locatorIndex) {
        // Valid identifiers in Perl: class, class_name, css, id, link,
        // link_text, partial_link_text, tag_name, name or xpath.
        // Defaults to 'xpath'.
        return {
            "class"        : '"class"',
            "id"           : '"id"',
            "link text"    : '"link_text"',
            "xpath"        : '"xpath"',
            "css selector" : '"css"',
            "name"         : '"name"'
        }[locatorType];
    },
    assert : function (step, escapeValue, doSubs, getter) {
        if (step.negated) {
            return doSubs(
                "if ({getter} eq {cmp}) {\n" +
                "    die \"!{stepTypeName} failed\";\n" +
                "}\n", getter);
        } else {
            return doSubs(
                "if ({getter} ne {cmp}) {\n" +
                "    die \"!{stepTypeName} failed\";\n" +
                "}\n", getter);
        }
    },
    verify : function (step, escapeValue, doSubs, getter) {
        if (step.negated) {
            return doSubs(
                "if ({getter} eq {cmp}) {\n" +
                "    print \"!{stepTypeName} failed\";\n" +
                "}\n", getter);
        } else {
            return doSubs(
                "if ({getter} ne {cmp}) {\n" +
                "    print \"{stepTypeName} failed\";\n" +
                "}\n", getter);
        }
    },
    waitFor : "",
    store : "${variable} = {getter};\n",
    boolean_assert:
      "if ({posNot}{getter}) {\n" +
      " die (\"{negNot}{stepTypeName} failed\");\n" +
      "}\n",
    boolean_verify:
      "if ({posNot}{getter}) {\n" +
      " print \"{negNot}{stepTypeName} failed\";\n" +
      "}\n",
    boolean_waitFor: "",
    boolean_store:
      "${variable} = {getter};\n",
    boolean_getters: {
      // "TextPresent": {
      //   getter: "(strpos($wd->find_element(\"//html\", \"xpath\")->get_text(), {text}) ne false)",
      //   vartype: ""
      // },
      // "ElementPresent": {
      //   getter: "(strlen($wd->find_element({locator}, {locatorBy})) != 0)",
      //   vartype: ""
      // },
      // "CookiePresent": {
      //   getter: "($wd->getAllCookie({name}))",
      //   vartype: ""
      // },
      // "AlertPresent": {
      //   getter: "alert_present($wd)",
      //   vartype: ""
      // },
      "ElementSelected": {
        getter: "($wd->find_element({locator}, {locatorBy})->is_selected())",
        vartype: ""
      }
    },
    getters: {
      "BodyText": {
        getter: '$wd->find_element("//html", "xpath")->get_text();',
        cmp: "{text}",
        vartype: ""
      },
      "PageSource": {
        getter: "$wd->get_page_source();",
        cmp: "{source}",
        vartype: ""
      },
      "Text": {
        getter: "$wd->find_element({locator}, {locatorBy})->get_text();",
        cmp: "{text}",
        vartype: ""
      },
      "CurrentUrl": {
        getter: "$wd->get_current_url();",
        cmp: "{url}",
        vartype: ""
      },
      "Title": {
        getter: "$wd->get_title();",
        cmp: "{title}",
        vartype: ""
      },
      "ElementValue": {
        getter: "$wd->find_element({locator}, {locatorBy})->get_value();",
        cmp: "{value}",
        vartype: ""
      },
      "ElementAttribute": {
        getter: "$wd->find_element({locator}, {locatorBy})->get_attribute({attributeName});",
        cmp: "{value}",
        vartype: "String"
      },
      "CookieByName": {
        getter: 'get_cookie($wd->get_all_cookies(), {name})',
        cmp: "{value}",
        vartype: ""
      },
      "AlertText": {
        getter: "$wd->get_alert_text()",
        cmp: "{text}",
        vartype: ""
      },
      "Eval": {
        getter: "$wd->execute_script({script})",
        cmp: "{value}",
        vartype: ""
      }
    },
    /**
     * Processes a parameter value into an appropriately escaped expression. Mentions of variables
     * with the ${foo} syntax are transformed into expressions that concatenate the variables and
     * literals.
     * For example:
     * a${b}c
     * becomes:
     * "a" . b . "c"
     *
     */
    escapeValue : function (stepType, value, pName) {
        if (stepType.name.startsWith("store") && pName == "variable") {
            return value;
        }
        if (stepType.name == "switchToFrameByIndex" && pName == "index") {
            return value;
        }
        // This function takes a string literal and escapes it and wraps it in quotes.
        function esc(v) {
            return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
        }

        // The following is a transducer that produces the escaped expression by going over each
        // character of the input.
        var output = ""; // Escaped expression.
        var lastChunk = ""; // Accumulates letters of the current literal.
        var hasDollar = false; // Whether we've just encountered a $ character.
        var insideVar = false; // Whether we are reading in the name of a variable.
        var varName = ""; // Accumulates letters of the current variable.
        for (var i = 0; i < value.length; i++) {
            var ch = value.substring(i, i + 1);
            if (insideVar) {
                if (ch == "}") {
                    // We've finished reading in the name of a variable.
                    // If this isn't the start of the expression, use + to concatenate it.
                    if (output.length > 0) {
                        output += " . ";
                    }
                    output += "$" + varName;
                    insideVar = false;
                    hasDollar = false;
                    varName = "";
                } else {
                    // This letter is part of the name of the variable we're reading in.
                    varName += ch;
                }
            } else {
                // We're not currently reading in the name of a variable.
                if (hasDollar) {
                    // But we *have* just encountered a $, so if this character is a {, we are about to
                    // do a variable.
                    if (ch == "{") {
                        insideVar = true;
                        if (lastChunk.length > 0) {
                            // Add the literal we've read in to the text.
                            if (output.length > 0) {
                                output += " . ";
                            }
                            output += esc(lastChunk);
                        }
                        lastChunk = "";
                    } else {
                        // No, it was just a lone $.
                        hasDollar = false;
                        lastChunk += "$" + ch;
                    }
                } else {
                    // This is the "normal case" - accumulating the letters of a literal. Unless the letter
                    // is a $, in which case this may be the start of a...
                    if (ch == "$") {
                        hasDollar = true;
                    } else {
                        lastChunk += ch;
                    }
                }
            }
        }
        // Append the final literal, if any, to the output.
        if (lastChunk.length > 0) {
            if (output.length > 0) {
                output += " . ";
            }
            output += esc(lastChunk);
        }
        return output;
    },
    usedVar : function (varName, varType) {
        return "$" + varName;
    },
    unusedVar : function (varName, varType) {
        return "my $" + varName;
    }
});
