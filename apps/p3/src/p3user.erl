-module(p3user).
-export([check_bind/2, pass_change/4, user_safe/2]).
-include_lib("eldap/include/eldap.hrl").

-define(BASE, {base, "DC=ad,DC=lolware,DC=net"}).

check_bind(Username, Password) ->
    % The below function can be used as a debugging function passed to eldap:open
    % K = fun(_Level, Format, Arg) -> io:fwrite(Format, Arg) end.
    {ok, Handle} = eldap:open(["127.0.0.1"], [{port, 1636}, {ssl, true}, {timeout, 500}]),
    ok = eldap:simple_bind(Handle, Username ++ "@ad.lolware.net", Password),
    Handle.

user_safe(Handle, Username) ->
    {ok, Result } = eldap:search(Handle, [?BASE, {attributes, 
        ["distinguishedname", "isCriticalSystemObject", "objectClass"]},
        {filter, eldap:equalityMatch("userprincipalname", Username ++ "@ad.lolware.net")} ]),
    User = hd(Result#eldap_search_result.entries), % Guaranteed one user at most
    Attributes = User#eldap_entry.attributes,
    true = lists:member("user", proplists:get_value("objectClass", Attributes)),
    undefined = proplists:get_value("isCriticalSystemObject", Attributes),
    hd(proplists:get_value("distinguishedName", Attributes)).

pass_change(Handle, DN, Oldpass, Newpass) ->
    Encodeold = unicode:characters_to_binary("\"Kevin111\"", utf8, {utf16, little}),
    Encodenew = unicode:characters_to_binary("\"Kevin222\"", utf8, {utf16, little}),
    eldap:modify(Handle, DN,
       [eldap:mod_delete("unicodePwd", [Encodeold]),
        eldap:mod_add("unicodePwd", [Encodenew]) ]),
    eldap:close(Handle).
