import Link from 'next/link'
import React from 'react'

const Recover = () => {
  return (
    <div>
        <Link href={'./recoveryPage'}>
            <button>Recover seed phrase</button>
        </Link>
    </div>
  )
}

export default Recover