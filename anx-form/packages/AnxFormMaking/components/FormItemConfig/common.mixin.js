import axios from 'axios';

export default {
  data() {
    return {
      files: new FormData()
    };
  },
  methods: {
    addMethod() {
      this.activeCom.options.options.push({
        value: `Option${new Date().getTime()}`,
        label: `Option${new Date().getTime()}`
      });
    },
    movingMethod(action, index) {
      const optionKey =
        this.activeCom.options.sourceType === 'image'
          ? 'imageOptions'
          : 'options';
      let num = 0;
      action === 'up' ? (num = -1) : (num = 1);
      this.activeCom.options[optionKey][index] = this.activeCom.options[
        optionKey
      ].splice(index + num, 1, this.activeCom.options[optionKey][index])[0];
    },
    delMethod(index) {
      const optionKey =
        this.activeCom.options.sourceType === 'image'
          ? 'imageOptions'
          : 'options';
      this.activeCom.options[optionKey].splice(index, 1);
    },
    uploadChange(file) {
      this.files.append('images', file.raw);
    },
    uploadImage() {
      axios
        .post(this.activeCom.options.uploadUrl, this.files)
        .then(res => {
          const imageInfo = res.data.data[0];
          this.activeCom.options.imageOptions.push({
            ...imageInfo,
            label: imageInfo.url,
            value: `Option${new Date().getTime()}`
          });
          this.files.delete('images');
        })
        .catch(() => {
          this.files.delete('images');
        });
    },
    delImage(index) {
      axios
        .get(this.activeCom.options.deleteUrl, {
          params: {
            imageId: this.activeCom.options.imageOptions[index].id
          }
        })
        .then(() => {
          this.delMethod(index);
        })
        .catch(() => {
          this.files.delete('images');
        });
    }
  }
};
