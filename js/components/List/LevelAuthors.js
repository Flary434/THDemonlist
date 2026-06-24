export default {
    props: {
        author: {
            type: String,
            required: true,
        },
        first_victor: {
            type: String,
            required: true,
        },
    },
    template: `
        <div class="level-authors">
            <template v-if="selfVerified">
                <div class="type-title-sm">Publisher & First Victor</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
            </template>
            <template v-else>
                <div class="type-title-sm">Publisher</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
                <div class="type-title-sm">First Victor</div>
                <p class="type-body">
                    <span>{{ first_victor }}</span>
                </p>
            </template>
        </div>
    `,
    computed: {
        selfVerified() {
            return this.author === this.first_victor;
        },
    },
};
