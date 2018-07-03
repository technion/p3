-module(p3user).
-export([check_bind/2, pass_change/4, user_safe/2]).
-include_lib("eldap/include/eldap.hrl").

-define(BASE, {base, "DC=ad,DC=lolware,DC=net"}).

% Function authenticates a username/password combo by binding 
% to LDAP server. Will return an open handle for further LDAP communication
-spec(check_bind(string(), binary()) -> eldap:handle()).
check_bind(Username, Password) ->
    % The below function can be used as a debugging function passed to eldap:open
    % K = fun(_Level, Format, Arg) -> io:fwrite(Format, Arg) end.
    Handle = case eldap:open(["127.0.0.1"],
            [{port, 1636}, {ssl, true}, {timeout, 500}]) of
    {ok, H} ->
        H;
    {error,"connect failed"} ->
        throw(connection_failed)
    end,
    case eldap:simple_bind(Handle, Username, Password) of
    ok ->
        ok;
    {error, invalidCredentials} ->
        throw(invalidCredentials)
    end,
    Handle.

% Security checks against a given using username.
% Looks up account by username and ensures:
% objectClass = user
% isCriticalSystemObject is not set
% Returns the DN
-spec(user_safe(eldap:handle(), string()) -> string()).
user_safe(Handle, Username) ->
    {ok, Result } = eldap:search(Handle, [?BASE, {attributes, 
        ["distinguishedname", "isCriticalSystemObject", "objectClass"]},
        {filter, eldap:equalityMatch("userprincipalname",
        Username)} ]),
    User = hd(Result#eldap_search_result.entries), % Guaranteed one user at most
    Attributes = User#eldap_entry.attributes,
    true = lists:member("user", proplists:get_value("objectClass", Attributes)),
    undefined = proplists:get_value("isCriticalSystemObject", Attributes),
    hd(proplists:get_value("distinguishedName", Attributes)).

% Change user password
% A constraint violation means password policy was not met
-spec(pass_change(eldap:handle(), string(), binary(), binary()) -> ok).
pass_change(Handle, DN, Oldpass, Newpass) ->
    case eldap:modify(Handle, DN,
       [eldap:mod_delete("unicodePwd", [encode_password(Oldpass)]),
        eldap:mod_add("unicodePwd", [encode_password(Newpass)]) ]) of
    ok ->
        ok;
    {error, constraintViolation} ->
        throw(constraintViolation)
    end.

encode_password(Password) ->
     Quote = <<$">>,
     unicode:characters_to_binary(
       <<Quote/binary, Password/binary, Quote/binary>>, utf8, {utf16, little}).
