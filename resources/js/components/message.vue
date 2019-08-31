<template>
    <div class="message">
        <li class="list-group-item" style="max-width: 80%;" :class="className"><slot></slot></li>
        <small class="badge" :class="badgeClass">{{ user + ' - ' + time}}</small>
    </div>

</template>

<script>
    export default {
        props:
        [
            'color',
            'user',
            'time',
            'float'
        ],
        computed:
        {
            className()
            {
                return 'list-group-item-'+this.color+' '+this.float
            },
            badgeClass()
            {
                return 'badge-'+this.color+' '+this.float
            }
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
