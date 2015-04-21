define(function(){
    var tipTemplate =  '<p>' + '{{= welcome }}' + '</p>';

    var contentTemplate =
                '{{ for (var i = 0; i < list.length; i ++) { '
            +         'var self =   list[i];'
            +         'if( self.me ) { '
            +    '}}'
            +         '<div class="chat-item my-chat-item">'
            +         '{{ }else{ }}'
            +         '<div class="chat-item">'
            +         '{{ } }}'
            +           '<div class="user-title">'
            +                '<span> {{= self.user }} </span>  '
            //+                '<span class="user-phone-number">{{= phone }}</span>'
            +                '<span class="create-time">{{= self.time }}</span>'
            +           '</div>'
            +            '<div class="chat-content">'
            +                '<p>{{== self.content }}</p>'
            +            '</div>'
            +        '</div>'
            +    '{{ } }}';

    var errorTemplate =
            '<div class="chat-item">'
        +            '<div class="chat-content">'
        +                '<p class="post-msg-err">{{== content }}</p>'
        +            '</div>'
        +    '</div>';



    return {
        tipTemplate : tipTemplate,
        contentTemplate : contentTemplate,
        errorTemplate : errorTemplate
    }

});