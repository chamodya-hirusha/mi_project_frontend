import { useState } from "react";

// Brand Logo Component - Using multiple CDN sources with guaranteed fallbacks
export const BrandLogo = ({ brand, className = "" }: { brand: string; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  // Brand data with multiple logo sources and brand colors
  const brandLogos: { [key: string]: { logos: string[]; color: string; initials: string } } = {
    // Luxury Brands
    "mercedes-benz": {
      logos: [
        "https://logo.clearbit.com/mercedes-benz.com",
        "https://cdn.brandfetch.io/mercedes-benz.com/w/400/h/400",
        "https://img.logo.dev/mercedes-benz.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#242424",
      initials: "MB"
    },
    bmw: {
      logos: [
        "https://logo.clearbit.com/bmw.com",
        "https://cdn.brandfetch.io/bmw.com/w/400/h/400",
        "https://img.logo.dev/bmw.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#0066B1",
      initials: "BMW"
    },
    audi: {
      logos: [
        "https://logo.clearbit.com/audi.com",
        "https://cdn.brandfetch.io/audi.com/w/400/h/400",
        "https://img.logo.dev/audi.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#BB0A30",
      initials: "A"
    },
    porsche: {
      logos: [
        "https://logo.clearbit.com/porsche.com",
        "https://cdn.brandfetch.io/porsche.com/w/400/h/400",
        "https://img.logo.dev/porsche.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#B12B28",
      initials: "P"
    },
    jaguar: {
      logos: [
        "https://logo.clearbit.com/jaguar.com",
        "https://cdn.brandfetch.io/jaguar.com/w/400/h/400",
        "https://img.logo.dev/jaguar.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#000000",
      initials: "J"
    },
    "land rover": {
      logos: [
        "https://logo.clearbit.com/landrover.com",
        "https://cdn.brandfetch.io/landrover.com/w/400/h/400",
        "https://img.logo.dev/landrover.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#005A2B",
      initials: "LR"
    },
    volvo: {
      logos: [
        "https://logo.clearbit.com/volvocars.com",
        "https://cdn.brandfetch.io/volvo.com/w/400/h/400",
        "https://img.logo.dev/volvocars.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#003057",
      initials: "V"
    },
    peugeot: {
      logos: [
        "https://logo.clearbit.com/peugeot.com",
        "https://cdn.brandfetch.io/peugeot.com/w/400/h/400",
        "https://img.logo.dev/peugeot.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#1C4B9E",
      initials: "P"
    },

    // Japanese Brands
    toyota: {
      logos: [
        "https://logo.clearbit.com/toyota.com",
        "https://cdn.brandfetch.io/toyota.com/w/400/h/400",
        "https://img.logo.dev/toyota.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#EB0A1E",
      initials: "T"
    },
    honda: {
      logos: [
        "https://logo.clearbit.com/honda.com",
        "https://cdn.brandfetch.io/honda.com/w/400/h/400",
        "https://img.logo.dev/honda.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#CC0000",
      initials: "H"
    },
    nissan: {
      logos: [
       "https://www.bing.com/th/id/OIP.94fGlb6fsTe0YAwMffIz1QHaHa?w=197&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
      ],
      color: "#C3002F",
      initials: "N"
    },
    mazda: {
      logos: [
        "https://logo.clearbit.com/mazda.com",
        "https://cdn.brandfetch.io/mazda.com/w/400/h/400",
        "https://img.logo.dev/mazda.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#000000",
      initials: "M"
    },
    suzuki: {
      logos: [
        "https://logo.clearbit.com/globalsuzuki.com",
        "https://cdn.brandfetch.io/suzuki.com/w/400/h/400",
        "https://img.logo.dev/suzuki.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#E30613",
      initials: "S"
    },
    mitsubishi: {
      logos: [
        "https://logo.clearbit.com/mitsubishi-motors.com",
        "https://cdn.brandfetch.io/mitsubishi.com/w/400/h/400",
        "https://img.logo.dev/mitsubishi-motors.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#E60012",
      initials: "M"
    },
    subaru: {
      logos: [
        "https://logo.clearbit.com/subaru.com",
        "https://cdn.brandfetch.io/subaru.com/w/400/h/400",
        "https://img.logo.dev/subaru.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#003DA5",
      initials: "S"
    },
    daihatsu: {
      logos: [
        "https://logo.clearbit.com/daihatsu.com",
        "https://cdn.brandfetch.io/daihatsu.com/w/400/h/400",
        "https://img.logo.dev/daihatsu.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#ED1C24",
      initials: "D"
    },
    isuzu: {
      logos: [
        "data:image/webp;base64,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"
      ],
      color: "#E03C31",
      initials: "I"
    },

    // Korean Brands
    hyundai: {
      logos: [
        "https://logo.clearbit.com/hyundai.com",
        "https://cdn.brandfetch.io/hyundai.com/w/400/h/400",
        "https://img.logo.dev/hyundai.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#002C5F",
      initials: "H"
    },
    kia: {
      logos: [
        "https://logo.clearbit.com/kia.com",
        "https://cdn.brandfetch.io/kia.com/w/400/h/400",
        "https://img.logo.dev/kia.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#BB162B",
      initials: "K"
    },
    ssangyong: {
      logos: [
       "https://th.bing.com/th/id/OIP.hs2tyYMY4VeRBfn_F6l4wQHaEH?w=307&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
      ],
      color: "#1C4B9E",
      initials: "SY"
    },

    // European Brands
    renault: {
      logos: [
        "https://logo.clearbit.com/renault.com",
        "https://cdn.brandfetch.io/renault.com/w/400/h/400",
        "https://img.logo.dev/renault.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#FFCC33",
      initials: "R"
    },
    volkswagen: {
      logos: [
        "https://logo.clearbit.com/vw.com",
        "https://cdn.brandfetch.io/volkswagen.com/w/400/h/400",
        "https://img.logo.dev/vw.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#001E50",
      initials: "VW"
    },
    ford: {
      logos: [
        "https://logo.clearbit.com/ford.com",
        "https://cdn.brandfetch.io/ford.com/w/400/h/400",
        "https://img.logo.dev/ford.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#00274D",
      initials: "F"
    },

    // Chinese Brands
    byd: {
      logos: [
        "https://cdn.brandfetch.io/byd.com/w/400/h/400",
        "https://logo.clearbit.com/byd.com",
        "https://cdn.simpleicons.org/byd/0066CC"
      ],
      color: "#0066CC",
      initials: "BYD"
    },
    mg: {
      logos: [
        "https://logo.clearbit.com/mg.co.uk",
        "https://cdn.brandfetch.io/mg.com/w/400/h/400",
        "https://img.logo.dev/mg.co.uk?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#8B0000",
      initials: "MG"
    },
    geely: {
      logos: [
        "https://cdn.brandfetch.io/geely.com/w/400/h/400",
        "https://logo.clearbit.com/geely.com",
        "https://img.logo.dev/geely.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#0052A5",
      initials: "GE"
    },
    chery: {
      logos: [
       "https://th.bing.com/th/id/OIP.t5XMykt_XJdSRrR6rni0LgHaHk?w=168&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
      ],
      color: "#C8102E",
      initials: "CH"
    },
    changan: {
      logos: [
            
        "data:image/webp;base64,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"
      ],
      color: "#003DA5",
      initials: "CA"
    },
    dfsk: {
      logos: [
        "https://cdn.brandfetch.io/dfsk.com/w/400/h/400",
        "https://logo.clearbit.com/dfsk.com",
        "https://img.logo.dev/dfsk.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#E60012",
      initials: "DF"
    },
    jac: {
      logos: [
        "data:image/webp;base64,UklGRnAXAABXRUJQVlA4IGQXAABwYwCdASrEALQAPp1MnkwlpCKiJDZqsLATiWlsYTnXmQ9+l0j/4+eQ0h6donf+raMnQ0gplPiaQZvb5gU9Pfjz/F8Nf0T3Odtm/vQwj9Pjv4f/g+od69/1HBE7r4XP1L/e/4L2BpvX5zqAcPF+D9Qb9Cf777gPlg/7v9B/ovX39Jf+b/W/AZ/Nf7X/0/XH9jn7U+zB+vhC+4E3NiAFRS1tcBrJOPgIxQ48+1MfoTtXh4SXdLhJhjqz18uPUkpnHa2N3DUnmVUNA14dHGYByBXsrAsA2yylR674WjPRCzug7d17XhPEGljzv9kQol16mumOZpBYD79mqJivagYndJL+Jp1G59jiQgU//HzYZhJqIE2WkqDzzRcjlNx0e5+xAu4dtzhiGWoq9MfzbP41x80+Fg6xYbbBHm2R+NJvoQX8ZEct5VoUvDkpFhrHdLJYi+o/SZfqY9Omnf09H8sjbdxCLa4dOD6Y08ZzKqLFhVOwGRaPWt7qnJ4K9E9KDOlZk0euVYVtJ07SuWOOqICwgsKj1G1ppL0JnALAWRUua6O+WS5B0Q3XHS/mUZ9nLrpPMxX/9QmKxTz45VGTLZYmQHQ4uxDPOiMVdjOZqA/VgREXcj3YHepgFrmHsZVp3se9vEve4TYOp8w8k1lZJv10kxHC8CnMMwrjN27R7NW0HZ8jwypf6w3E10POvHzUjdEhITA6ccn5BRHvUfY862O5jF0gtezQBxADcM0t1pEmrdRbYdbqf/1/3jnGeUtmIomcunaW971uonp5e57mAJUsV5ECoxbYnrKYT5jvok/tQ2dp1SB/S8+QGwsVRqNKPvoujohEzo74B5S+tU+Q4a0hxlUov1taXBQH0J/T4uOayBAuYNKa4mAobC6t7BZP/9x694jl9VCTa5F8sLiLwPTVUB9LBi+yLV5CwD9cDq39RG0wpls4ph69J1ArU6Xd0EmHFIqZ//FACSuh/p/f+Rm4gWLrt9esUVcSs21s0VtcVS3ZKBA7FzU9BkHfc0c5+zqL+3MPYht6vgR7mTYzVYufpT0hCnA/xQmGbrfxYBxU4FHt/b8MIAAA/vztbY36ILYZvRGj5MFczHJj8Cd+8KNUSrek8gJUONe4I9pin3SstCbvukJmwnmGjlQAixZi0mlQdXSxp5Nn+9vMPdndJ1/8McHTqIwXkQQGZYbOsdMMAFxT+4hYDn1PmtQcMjRtJ5QEoNNGzhMb8kort8Dwg74WlsE+wDX4BemR1ffbZd4G/M34AzDz0ocPaMJLWXq0JX+g1OB2ONe+3h547cALY1X+WauAjLSm1txCL39WFU8hHDq39kB1FrImfkRlW3SwnP7gWTPwnZ0oKLzr+ZwyTb8DAqE1KDPH2Zmdety+Z0J5Svfa8CdWiLiTBxrBH4qHmXAxsFt8L/9Acbn/+wodg4aLywyds2Kr9/OuUeTaqaKgyrvSvddaAel7WaTMffgcePhWVyhmiUGQ/6m4ajT9izIHRAowOJ17pm1igqUnVxTJePfZ1QmifM1ElhbM0xNX1Sy2o8oKRawz9WLzmqlFz89UCAPXoPpxO970bDCF3ZlBSwh1Q2Y3gcrsU3A22W1ePHlYXLdtKhdPM0S5mgY/WqfAFz8QXEIsptfLuF4yx4GEXgegOt/p1HTLheUQZaGOuZAyihqj3KrLW0WxkLfQSN6WuJYgxW9t0RW+COJZe1kgNNb7XW2I0YVs/2nUQXKotMSl6rUCDhHHGajyp9FPwb4vbnS5WvOKgXrsXBNIT9HRzH0AO0NfNnNci1xir/gCMmGTyHR3S1Lgjf/zllrCOsGOmalIERW5JrSviBx8ypXWzHOl/zaRkvoM0hs8jCZxgKtb3AQnkHKAcICGP906mePsFwAV3Q9Jzo7qHFK7ShhfZ2L9DE8wn3NN6O6fjquvznfTAmP9mFDoPURhXjn/6NmwvaW9rE3DeU/Rgn4VyO/AY74HTdkQfRWvqq0r+w8L4j4r8kzgWKc8S3lBxOw80lw2sJOmxA6eQ6+YLMyqXXJ2PfVqZFoFHSNArbAt/+HCz+GmhHF2Jy5DpIrvcbD/+pId4viUzCTekEz3GUZz3ddR3nQYtutG+NDJxUY6izJcsSOccG2n5N11Ec1rXkaRKS+gcXc38TYg/UJhCwV7vkGvpfXg84+TsaQpk4rTQzuc6Kc8nvdVCFdrmgEsZPAlgjzeYMe7J4E/c0Z4L36Bs3Y3cJYG9zgnEqhUf9wYvg/P3jXvmTXDdABubC+KutrIygQFOGcWKJQ1bgeBUxCi00KMbOnA+gawuZol5LURQHujFCKJCpSIGTQ3UYJDHmYreHh3GAVWxZKpXpj2WWxJMK+zKndsohR6a6QGDpWAFy0dQEllvhz48/f5/o8pN5tp1x1jrxy3y5xKFpMMp7LgJbEXANNeacDxswcoOQfj1TS670qS+1U5OtW5id+PExDpLUwB4GTY9j6vlB+tb7m+AUJGtpZaHcm29odztQ5jhkkX/p/mlya1orS1IR9Xv5Khbh1AaX1dUjB+Zf7XN1ly62Kp7i+dLMztwsKKPZecM3PDNvUBVXXcWLat6UQWlvIimHt/VTX/zulXBUabHZqMtZGMHc8iPNj24KgoYQjS3PhmXfUmGT/8hABZU1n8tMfkDZ3SFgzgOQx4bon/szM3nMglOi7QKzcdjVkM1W2mnThCdfV6dMGwrFvgCTNX5N5Uqvt9O2j7fyY6euYtd/OnOFFTGVUX5/J0TZlYZLs7EoDreyfnSjc8I/eK2nP371/Uv23O31rB5zBDi+/AwX0f6Gb51G8XUdyXscfW5eAaRSHtLBFT1AuxDHmp6/rZzNHUN0zi/ameJTBLwOdg0Me8+n77FjZUfe7qAVZ2NveOEQjn41f1g6NOBq2ki/drgv/ke4oiHoPcwrFfUmi8/iuG866dQP5LIPvQsIgeNafQL7MTc3MqP0YIXheD3fBl+94KE/48dceMRcDl770KyHfAno9vlBZb0+lfKmDL4n3T+4/PMWWXG5iKCOFLb/uDvOuubsP2MXq4XySvZ5x+tStXW3oID96I/Sz7bA+Z5YpY+SuGdwk5atUCRXht4tJc9XW5HXmBZeS8pFv5FObaw+jqe1dt/8GenTLertkJoDKp6rrh1WPsVlIEO3Flxk6/3vyWaP9tRqfFX9OpKlyP/99uSM1LHR3ZWEfcIMDkw3E3SIypSwgJl999lQHDGs6FXNfWlYkmd4+Ik2QSLVe1aHQSGeAB+FroXpo8vEbqAwfl38KIHl6B2oKeIu3K1uLu5PKElT8Y87HGajyQKPq2skOGaQLFnr0FhwRMVaY9ay+V1VPFzXMDH9v/OjLepReEBnDlKMaRXLtF6wY51SxWK/culgZsGR2NqLeiCxW5FSu0L5/4n+OV2RTDbJ7FmLbxgSgs8NCTus7dZleazOfG4I7xImYKPJLQ0KMfCG9sPBCDddikO19T5tNc1H1uHiyauYhCnviBE+8dbGKr7A0Cg29/ddJGWMUOTNB4xCPNIYcRcEcNtEgiDvtxFtPB/NOZCyMm5YdS7xZPR+2C7KJKntl0OJaBZZ3nJuO6oFFKiu8m8i78g0tymfe72qKqq9/xP0mo/3y6FLHcCwN+pj1dXGhI7khNdtLoXDacb97x7ZQ1F9MRTXNh78F5iiHM2ZLpLvmeHL3bAH/IotS77wgrGl95iRwhg+hgOqNIhZN7hX5t/1Gzb8lf7v41KMo2TxSMGUqJWtfUYvGJ5AF3UCZQWKjwj1l/KkdcMmUr9LNj4+mIbvqRPK/UseLzJ+pjH3FiJ60EcCn+OvL/G9/Ilq1lp1ehsqir15tUrrGqP8ISyxGBmmKNkGoSOvUhLOq5Eqput+s7Id576lIgf29J3NTISA6x8sEfcIl5Geu0KHSmwXzIhy50HFMqn27ZZkPHqVM4e2QarnVAPZmhF8YL+u2ieRg0Qd+P73eVnAuGjmnSgwu3FICQR1clCNwXuVdXei5GasWojjvKytog9k8ub+BCStsTjq4eOZMmDMYku3oGapKYDEYEeyqBJolqTzv6Iu1kuUsVzHFvwCRtErKpAVrJ4uaNzQ0tuhvkWxMF1/W6sr2l52T6gJxpmOA3l/lM7lMxYvGpOY0cOnjPhfPtf7Il7Skj5wU9F72/QsvWPah6AenKGtlhjIY0uVuvYRiJ4E6QcSVRyCd2Yku+7jWRkOoPnf9XYcNK8OX89RxExeraSdpl20Q7dkwOnVf+yYWoxEJgxavIsPjOlnpvvKCWpDjIYuOJUpV2LBTYr/F2+iCSJTt8EAunTR77qgXSjJEXiOqZ1ADG76xtyqaOEm/90o2Re7KLEBmfJTGE6+8gWGWZfXnav0hb1LHOztaRg+9FGdjFpap5y0j3kL5rjmDs+y0F4GRvWNnQwpdcJgebJvP+U9uB9nBH9cdwWqeAW+aUHzUzGlqlz/c7dh13aPkm+3DDc5RDPghBE0eRRZm/FqPAyHcghdUPbuQGMXzjcP0nY7AkaUvMkgIhP0S/bJqf7FXvYKLy3hPjA+lEgzIOa1j2MvZsrEnACAjBKN6aKqp/lKTIwOMKBHCh50lJfBR6uBhKl+KlFzvX7qs/AOcUb+ev8h+W+ipRvK3YgpoJVZnjbtNTnIO5LQH2Wm5+Gd+fWt+t9d61hAj/ttpa6sBSCgLbshmQu/DT44a4cOhnefVpogXrBpNMt8jWyMJsVPA4IBpt+6QOymZKOtkkxvt5NKRxMfH4M6Erktv2CcSswkSjJjfkjz4EDNRKOxhtefyDaJZ7x6UvZEQHjSo6DTxWT+xDHmpuue+3U8eC5cfSj3p22B91OrgL6IRyuhyB9Qt7SJVBaP0pzYNC/pvJ3OdhfHRbjSorGLe7z+XfdMuyxZUzzX2nTcdpRncQPlitgYRqZx2RyAiGVYTeVitpugR7cvRI567o9vW0BzK+wM8E0B9caOl3l+LV8rVIRQZSNTFMSucv/13ICpu83FGHp2/JQzzycOf1lPdDpLvzcOUonPAXV7Wis1iiweJsUi5AcZgA1hZIB87Wy/njokTtIxGbB4gZ3mRW0kjg8MJ97+cY0D8fTzE/UAROuwMNdtHlmOA/xkqPyFe7IsYMhqyPU9fbQpF11xMvNMgc0zgdBZ5nJC8WBZw0xIiz1UtD2NYiYhNNna6iFglPbTvoQCeQtkOCNLtyxWdiDG0wvtqvOPqptoZDMAbJvb2nxVXAfer672o7n5dYNnExCfYVdZQLxL+puBeA+h1ibAM+SnAEfav4Cn2Q+k3DzP9Y+fnHC4je3SFnR3tr+9+aBUZ72xvRE+DK5aH/xtPBAnjYUX8aHqvxare42bRh7bT5dIAkNu9WSlDVEMyKQuKXzG473c4NnZOjHGuq3K9pkdZ3CicG3Gs5TcVFd74hKpF++I9vDOPkb0TRHMDrjV6opZ0NSwqot8ZiTCaVFoHcGb/I7uNKMnFGGTsZtS4ewAZxJbvHGjnQhm8ZTPdS8ijosyZQuzYGHiM5R5vtGS101ppokIQeIpMzCu9//ZZdbr3J9N7xR9lTOcuJn7pS1UOEPlqbH7EK6g1KSY7fJONyRpAHIwP3rqDEib3HppbDVP1JufEdxNQS/p0LWiyjZPIEf3lbQPKhGDf9qY/ImxsM8OaTiYTINtW7PMHQZfloHya0P88XrQPQbiKsRAT/9qHa6qOYOrHSuS5w+9M2SlqCL4/fnw1A2rr92Y3Mg3kzZPHYegxOXMj7txq4hBcURaiZLYT0s46vtgdz/8OWh/LgdR0diCEi9hPhjGztYNPCG7h8EhIfE46HvBwHTJhM4uD6Xq26Kf+jdLV6PJkVFVQFXz9Dv0BnaOrM7zmbDo7mCwTtKUvysQIeOEF0hgiUxbvKnMdcMDJZBPlYMmB813ulr/csqzKCuml24m0jUBTWnJk17ddhFdNFXHiI2+Azc0nBWkDvNkDMKzeUJgOI1Xsk+XbLODDt9Nc8JzBPiqF5CGti2/Fl+RUOxCRJpuppGIv8dz+ho2SJED9TPvIGrzReXxTuOJoY8WjlCkmlN6fXwiAj7qtfEwZlcjluRhwQobzDFDtq2afi1tJlUJTAQXmlQG0n/8KO70rFl1H15dgvw7YxKUYEMUfCwrargAHuxhDXNAoPcGD01H/hWb69ThvOWBZ8emyCEOPErx+wxPoqMECSHbZRR8Qi02Ma6U9B9gaShVfCgSIenTy1x3h/QPB6RZNOSZ3rUrNPMcMy9DUPBDIewt/9kjAMI1I+Xlq/MKHzN2WnSRHV9nUEtUrjpZX5FuahXPAWoeB4TVuNzbAqzQbZOYdeWE9LLGt9OHx9990xESHTMLCvPZ29YP7Gl1zP9HaYR98KMiE8qTpC8t2Wv+kEuWmzQpYDKfFk+CyQ1qooQaLjYPp/7v8YMqvidvgiXKNPlhSRrNd4KLtQVJ835nl0w7pgvVeTnf/MWNH80ztWlT+yqYu4vSCHc5m7Dftmpr+67QtOCFWVf0Cc8hJaXnv+KGKyusGWfCePV8/0icYDfgD4MaFksKNDR/rc2xLDxDldLg+x1fKpMUq8MorPGmwZ5cUWhTBtHzXnptFAc9+IgXwqugFm0tNET9v3SxnGqDtuxxt7QeBsd79GUomvGS6W/Hj/Ka4a4kc4dI4cJpZsoh4CZsK8C8N4xK45iCNb2CuDPltCO6yltusQJHX00y1rH23uE6MvsTjt3m0Gw1nizs9eIOnxp0Nan2jYidKj5+fLhHaFPju7+QkczywBsya8Nh9tNsteJCAa+jJZUiWxyqIevKLicq6nTKHS/hn3TU4lwf996ouu3c5mBmp0AByjwSdabWFwRIAkDZl+f//aKF69DHkGG4sk1YquQ0Xv9Jj0bwEM3xMjNYWL5prxJpJ1dOMzl9kAdIhwxyaoXS77PhQl7eISY2xFhmGi3JE19Dc+8wQrCbjM29BZhRvFCDcw0JjG54JGmidks6gXOckqaal2C0Y5W0UonE/AfWZcZkgdJ5apgvC+rYB/8cWV+c1R5onLmeiU48yqaKlNgR3ER/y/jwrSzf6C85WmSo1ppDHeWMhd9CO553hFENytOZNbohuzIuAyVF0MoiqBbW6WkpWJRcwGEeEKUmVGTKhsvV1z+8K0Mjd5cxO3oOH3wkgMn+RyoxcyV4wYBjOG4n+03nV6mbAyURWS3PTIq0aYkoK1gbvgJHi7k5GDS8IH94FdDcTuqsr1OYoNdwe39DuO9WIXAIXEZAaskjEcAnYKI4N9/G2HeXu8QXdijt3r/J3RcCjQ0gJrXWtkr75A+CneMv0CpV45S2UM7aOY5Dphf/CRGF/L0AVV1ISwp54GiducWqnvBGicgNJgcWpGRjqBM7jMFEgYLau+qhRSYhQ1aTpwObhQ2im5FayQXttbbPXFju61BvjGXmCCZectCxGJ8ZuqkUDIBx3+HNa3shmVUKo3fiiF/eDzvvEDaL09ugeVUdzOMX2mPpF3CmwKZ679DpWT8aNXI0oxeqpYcdHT5dmuPM27a21svNUSg/6LTP1wz7Xjh2gaqQ8WQ82iR7Pyd9ejKt5oX2SEm6xZjAhuFkI7Grfg0RJYJqdz0ywrI7dNAbLjkE+Hik55Ps75QUFN6dbqJalzrnZaWSeFlvHYEVGM1qY3bjLTmhp6OdhXk/eljrnyQIfKpvnzLcmJJXc7aUwl8o0oTVN2L8FyKpFHPW6/ZYzVLqgWvQSFaJr1DmU6ZLcvpQHW/OrQOwmT2GvT5gKCqjurH5NUVZ/cy/1CCVDpIPNbaAGoB30LO86fjIW/PqoJ5ZG2tMQCbO8udd2OIzk260Ph8t8SkPIuuyn6l8orsXBfleqo3ZE9/GLj8rjFwlj0POeY1u3wsEocM9o56FMBs3Xl8FZxwEsGGvf8kGe+Q8whcb38tYpXKk/7UZ1/E6IsU+CIvyZNGYf8nf9ljCWkCNp3C4XlUaAHITwHVeZ4xWamZco2V8ydOvayzzYHWYD/fhpULlhjTrJ35JlRDgFjb+MGQkAAAAA="
      ],
      color: "#C8102E",
      initials: "JA"
    },
    foton: {
      logos: [
      "https://www.bing.com/th/id/OIP.4XbDJ3K6sOW_zRZRq7oJNAHaHa?w=176&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
      ],
      color: "#0066CC",
      initials: "FO"
    },
    baw: {
      logos: [
        "https://cdn.brandfetch.io/baw.com/w/400/h/400",
        "https://logo.clearbit.com/baw.com",
        "https://img.logo.dev/baw.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#003DA5",
      initials: "BA"
    },

    // Indian Brands
    tata: {
      logos: [
        "https://logo.clearbit.com/tata.com",
        "https://cdn.brandfetch.io/tata.com/w/400/h/400",
        "https://img.logo.dev/tata.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#0066CC",
      initials: "TA"
    },
    mahindra: {
      logos: [
        "https://logo.clearbit.com/mahindra.com",
        "https://cdn.brandfetch.io/mahindra.com/w/400/h/400",
        "https://img.logo.dev/mahindra.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#E2231A",
      initials: "MA"
    },
    "lanka ashok leyland": {
      logos: [
        "https://cdn.brandfetch.io/ashokleyland.com/w/400/h/400",
        "https://logo.clearbit.com/ashokleyland.com",
        "https://img.logo.dev/ashokleyland.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#003DA5",
      initials: "AL"
    },

    // Motorcycle Brands
    yamaha: {
      logos: [
        "https://logo.clearbit.com/yamaha-motor.com",
        "https://cdn.brandfetch.io/yamaha.com/w/400/h/400",
        "https://img.logo.dev/yamaha-motor.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#4B1E78",
      initials: "Y"
    },
    bajaj: {
      logos: [
        "https://static.vecteezy.com/system/resources/previews/024/555/227/original/bajaj-logo-transparent-free-png.png"
      ],
      color: "#0066CC",
      initials: "BA"
    },
    ktm: {
      logos: [
        "https://logo.clearbit.com/ktm.com",
        "https://cdn.brandfetch.io/ktm.com/w/400/h/400",
        "https://img.logo.dev/ktm.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#FF6600",
      initials: "KTM"
    },
    "royal enfield": {
      logos: [
        "https://logo.clearbit.com/royalenfield.com",
        "https://cdn.brandfetch.io/royalenfield.com/w/400/h/400",
        "https://img.logo.dev/royalenfield.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#000000",
      initials: "RE"
    },
    vespa: {
      logos: [
        "https://logo.clearbit.com/vespa.com",
        "https://cdn.brandfetch.io/vespa.com/w/400/h/400",
        "https://img.logo.dev/vespa.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#0082CA",
      initials: "V"
    },
    aprilia: {
      logos: [
        "https://logo.clearbit.com/aprilia.com",
        "https://cdn.brandfetch.io/aprilia.com/w/400/h/400",
        "https://img.logo.dev/aprilia.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#E2231A",
      initials: "AP"
    },
    tvs: {
      logos: [
        "https://cdn.brandfetch.io/tvsmotor.com/w/400/h/400",
        "https://logo.clearbit.com/tvsmotor.com",
        "https://img.logo.dev/tvsmotor.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#0066CC",
      initials: "TV"
    },
    hero: {
      logos: [
        "https://cdn.brandfetch.io/heromotocorp.com/w/400/h/400",
        "https://logo.clearbit.com/heromotocorp.com",
        "https://img.logo.dev/heromotocorp.com?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#E60012",
      initials: "HE"
    },
    piaggio: {
      logos: [
       "https://th.bing.com/th/id/OIP.XRHxdIzrv1_ius-vf1iSYQHaHk?w=154&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
      ],
      color: "#0082CA",
      initials: "PI"
    },

    // Commercial & Others
    fuso: {
      logos: [
      "https://th.bing.com/th/id/OIP.mNup9ZLHHhRPBB4pzDjI6AHaHa?w=140&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
      ],
      color: "#E60012",
      initials: "FU"
    },
    hino: {
      logos: [
    
        "https://th.bing.com/th/id/OIP._wEYfqOjUUSrZCOXUfiHYAHaG1?w=194&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
      ],
      color: "#E60012",
      initials: "HI"
    },
    perodua: {
      logos: [
        "https://cdn.brandfetch.io/perodua.com.my/w/400/h/400",
        "https://logo.clearbit.com/perodua.com.my",
        "https://img.logo.dev/perodua.com.my?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#003DA5",
      initials: "PE"
    },
    micro: {
      logos: [
        "https://cdn.brandfetch.io/microcars.lk/w/400/h/400",
        "https://logo.clearbit.com/microcars.lk",
        "https://img.logo.dev/microcars.lk?token=pk_X-kk9JGkQ_qHHRzW5eHOVQ"
      ],
      color: "#0066CC",
      initials: "MI"
    },
  };

  const brandKey = brand.toLowerCase();
  const brandInfo = brandLogos[brandKey];

  if (!brandInfo) {
    // Unknown brand - show generic fallback
    return (
      <div className={`bg-gray-500 flex items-center justify-center ${className} rounded-full`}>
        <span className="text-white font-extrabold text-lg md:text-xl tracking-tight uppercase">
          {brand.split(' ').map(w => w[0]).join('').substring(0, 2)}
        </span>
      </div>
    );
  }

  // If we have logo URLs and haven't exhausted all options
  if (brandInfo.logos.length > 0 && currentLogoIndex < brandInfo.logos.length && !imageError) {
    return (
      <div className={`bg-transparent flex items-center justify-center ${className} rounded-full overflow-hidden`}>
        <img
          src={brandInfo.logos[currentLogoIndex]}
          alt={`${brand} logo`}
          className="w-full h-full object-contain p-2"
          onError={() => {
            // Try next logo source
            if (currentLogoIndex < brandInfo.logos.length - 1) {
              setCurrentLogoIndex(currentLogoIndex + 1);
            } else {
              setImageError(true);
            }
          }}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: Brand-colored circular badge with initials
  return (
    <div
      className={`flex items-center justify-center ${className} rounded-full`}
      style={{ backgroundColor: brandInfo.color }}
    >
      <span className="text-white font-extrabold text-xl md:text-2xl tracking-tight uppercase drop-shadow-lg">
        {brandInfo.initials}
      </span>
    </div>
  );
};

