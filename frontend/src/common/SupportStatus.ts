
export const SupportStatus = {
    ACTIVE: 'ACTIVE',
    CANCELED: 'CANCELED',
    EXPIRED: 'EXPIRED'
}

export const getStatusText = (sts : string) => {
    switch (sts) {
        case SupportStatus.ACTIVE: 
          return 'EN VIGOR'
        case SupportStatus.CANCELED:
          return 'CANCELADA'
        case SupportStatus.EXPIRED:
          return 'EXPIRADA'
        default:
          return ''
    }
}
