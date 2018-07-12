-module(p3_api_handler).
-behaviour(cowboy_handler).

-export([init/2]).

init(Req0, State) ->
    Req2 = try
        <<"POST">> = cowboy_req:method(Req0), % Assert supported type
        true = cowboy_req:has_body(Req0),
        cowboy_req:read_body(Req0) of
    {ok, PostBody, Req1} ->
        processbody(PostBody, Req1)
    catch
    _Error:_Reason ->
        cowboy_req:reply(400, #{}, <<"Bad Request">>, Req0)
    end,
    {ok, Req2, State}.

processbody(PostBody, Req0) ->
    case jiffy:decode(PostBody, [return_maps]) of
    #{<<"oldpassword">> := OldPassword,
      <<"newpassword">> := NewPassword,
      <<"username">> := Username} ->
        changepassword(Req0, Username, OldPassword, NewPassword);
    _ ->
        cowboy_req:reply(403, #{}, <<"Invalid or missing parameter">>, Req0)
    end.

changepassword(Req, Username, OldPassword, NewPassword) ->
    try
        % Check for blacklisted characters
        LUsername = binary_to_list(Username),
        ok = validate:valid_name(LUsername),
        %Check rate limiting
        ok = ratelimit:ratelimit_name(LUsername),
        % Logon to LDAP - credential check
        Handle = p3user:check_bind(LUsername, OldPassword),
        DN = p3user:user_safe(Handle, LUsername),
        % Passwword reset by user DN
        ok = p3user:pass_change(Handle, DN, OldPassword, NewPassword),
        % Reset the password
        eldap:close(Handle)
    of
    _ ->
        cowboy_req:reply(200, #{}, <<"Reset OK">>, Req)
    catch
    throw:username_invalid_char ->
        cowboy_req:reply(403, #{}, <<"Invalid Parameter">>, Req);
    throw:username_not_valid ->
        cowboy_req:reply(403, #{}, <<"Invalid Parameter">>, Req);
    throw:invalidCredentials ->
        cowboy_req:reply(403, #{}, <<"Invalid Credentials">>, Req);
    throw:constraintViolation ->
        cowboy_req:reply(403, #{}, <<"AD Denied Password Change">>, Req);
    throw:banned ->
        cowboy_req:reply(403, #{}, <<"Username has been locked out">>, Req);
    throw:connection_failed ->
        cowboy_req:reply(500, #{}, <<"Server Unavailable">>, Req);
    Error:Reason ->
        io:fwrite("Debug log: ~p~n", [{Error, Reason}]),
        cowboy_req:reply(401, #{}, <<"Account Error">>, Req)
    end.
