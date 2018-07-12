%% @doc Caching module. Uses ETS to cache cache output.
-module(ratelimit).
-export([ratelimit_name/1, create_table/0, delete_table/0]).
-include_lib("stdlib/include/ms_transform.hrl").

-ifdef(TEST).
-define(LIFETIME, 2).
-else.
-define(LIFETIME, 900).
-endif.

%% @doc Call on app start to create a shared table.
-spec create_table() -> ok.
create_table() ->
    simple_cache = ets:new(simple_cache, [ named_table, set, public ]),
    ok.

%% @doc deletes the shared table.
-spec delete_table() -> ok.
delete_table() ->
    ets:delete(simple_cache),
    ok.

-spec now_secs() -> pos_integer().
now_secs() ->
    erlang:system_time(seconds).

%% @doc Expires old content
-spec cache_flush() -> ok.
cache_flush() ->
    % TODO
%    Now = now_secs(),
%    Selector = ets:fun2ms(fun({K, Expiry, _Res})
%            when Expiry < Now -> true end),
%    ets:select_delete(simple_cache, Selector),
    ok.

-spec ratelimit_name(string()) -> ok.
ratelimit_name(User) ->
    Now = now_secs(),
    case ets:lookup(simple_cache, User) of
    [] ->  %Not present in cache
        cache_flush(), %Flushing on add ensures size is managed
        ets:insert(simple_cache, {User, Now+?LIFETIME, 1}),
        ok;
    [{User, Expiry, Hits}] when Now < Expiry andalso Hits > 4 ->
        % Current blacklist with counter exceeded
        ets:insert(simple_cache, {User, Now+?LIFETIME, Hits+1}),
        throw(banned);
    [{User, Expiry, Hits}] when Now < Expiry ->
        % Current blacklist within hit threshold
        ets:insert(simple_cache, {User, Now+?LIFETIME, Hits+1}),
        ok;
    [{User, _Expiry, _Hits}] -> %Timeout expired
        % Will replace as this is a set
        ets:insert(simple_cache, {User, Now+?LIFETIME, 1}),
        ok
    end.

