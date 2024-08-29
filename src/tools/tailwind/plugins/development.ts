import plugin from 'tailwindcss/plugin'

export function developmentPlugin() {
  return plugin(function ({ addUtilities }) {
    addUtilities({
      '.dev-boxes:hover': {
        'outline': '1px dotted rgb(255 125 255 / 50%)',
        'outline-offset': '-1px',
        '& > *': {
          'outline': '1px solid rgb(255 0 255)',
          'outline-offset': '-1px',
          '& > *': {
            'outline': '1px dashed rgb(255 255 0 / 50%)',
            'outline-offset': '-2px',
            '&:hover': {
              'background-image':
                'repeating-linear-gradient(-45deg, rgb(0 255 255 / 15%), rgb(0 255 255 / 15%) 2px, transparent 2px, transparent 10px) !important',
              '& > *:hover': {
                'outline': '1px dashed rgb(0 255 255 / 50%)',
                'outline-offset': '-1px',
                '& > *:hover': {
                  'outline': '1px dashed rgb(0 255 255 / 50%)',
                  'outline-offset': '-1px',
                  '& > *:hover': {
                    'outline': '1px dashed rgb(0 255 255 / 50%)',
                    'outline-offset': '-1px',
                  },
                },
              },
            },
          },
        },
      },
    })
  })
}
