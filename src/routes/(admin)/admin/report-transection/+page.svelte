<script lang="ts">
	export let data: {
		listTransaction: any[],
		listUser: any[],
		startDate: string,
		endDate: string,
		name_th: string,
		status: string
	};
	let { listTransaction, listUser, startDate, endDate, name_th, status } = data;

	let listBank = {
		'002': 'BBL',
		'004': 'KBANK',
		'006': 'KTB',
		'011': 'TMB',
		'014': 'SCB',
		'017': 'CITI',
		'020': 'SCBT',
		'022': 'UOBT',
		'024': 'UOBT',
		'025': 'BAY',
		'030': 'GOV',
		'031': 'HSBC',
		'033': 'GHB',
		'034': 'AGRI',
		'039': 'MHCB',
		'065': 'TBANK',
		'066': 'ISBT',
		'067': 'TISCO',
		'069': 'KK',
		'070': 'ACL',
		'071': 'TCRB',
		'073': 'LHBANK',
		'079': 'ANZ',
		'080': 'SMTB',
		'098': 'SMEB'
	};
</script>

<div class="p-3">
	<h4 class="h4 fw-bold">รายงานธุรกรรม</h4>
	<form method="GET" class="d-flex flex-wrap mb-3">
		<input type="date" class="form-control w-56 me-2 mb-2" name="startDate" value={startDate} />
		<input type="date" class="form-control w-56 me-2 mb-2" name="endDate" value={endDate} />
		<input
			type="text"
			placeholder="ชื่อลูกค้า"
			class="form-control w-56 me-2 mb-2"
			name="name_th"
			value={name_th}
		/>
		<select class="form-control w-56 me-2 mb-2" name="status" bind:value={status}>
			<option value="">ทั้งหมด</option>
			<option value="TRANSACTION_SUCCESSFUL">TRANSACTION SUCCESSFUL</option>
			<option value="TRANSACTION_UNSUCCESSFUL">TRANSACTION UNSUCCESSFUL</option>
			<option value="RECEIVER_NOT_MATCH">RECEIVER NOT MATCH</option>
			<option value="AMOUNT_LESS_THAN_MINIMUM">AMOUNT LESS THAN MINIMUM</option>
			<option value="ERROR">ERROR</option>
		</select>
		<button class="btn btn-primary bg-primary me-2 mb-2" type="submit">ค้นหา</button>
		<a href="" class="btn btn-outline mb-2">ล้าง</a>
	</form>
	<div class="table-responsive mb-3">
		<table class="table table-hover">
			<thead>
				<tr class="bg-secondary-subtle">
					<th class="text-center">ลำดับ</th>
					<th>วันเวลาที่ตรวจสอบ</th>
					<th>เลขที่รายการ</th>
					<th>รหัสลูกค้า</th>
					<th>ชื่อ-นามสกุล</th>
					<th>ธนาคาร</th>
					<th>สถานะ</th>
					<th>BankStatusCode</th>
					<th>ErrorMsg</th>
					<th>Tranfer Bank ID</th>
				</tr>
			</thead>
			<tbody>
				{#if listTransaction.length === 0}
					<tr><td colspan="10">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each listTransaction as item, index}
						<tr class="text-start text-nowrap">
							<td class="text-center">{index + 1}</td>
							<td title={item.created_date}
								>{item.created_date 
									? new Intl.DateTimeFormat('en-GB').format(new Date(item.created_date)) 
									: '-'}
								  </td
							>
							<td>{item.id.toString().padStart('0', 5)}</td>
							<td>{item.user_id === 0 ? '' : item.user_id}</td>
							<td class="p-1 sm:p-2 lg:text-sm text-left truncate" title={listUser?.find(e=>e.id === item.user_id)?.name_th || "-"}
								>{listUser?.find(e=>e.id === item.user_id)?.name_th || "-"}</td
							>
							<td>{listBank[item.qr_code.slice(18, 21)] || item.qr_code.slice(18, 21)}</td>
							<td title={item.status}>
								<span>
									{#if item.status === 'TRANSACTION_SUCCESSFUL'}
										<small class="px-2 rounded-pill bg-success-subtle text-success"
											>{item.status.replaceAll('-', '')}</small
										>
									{:else}
										<small class="px-2 rounded-pill bg-danger-subtle text-danger"
											>{item.status.replaceAll('-', '')}</small
										>
									{/if}
								</span>
							</td>
							<td>{item.status_code}</td>
							<td title={item.message}>{item.message}</td>
							<td title={item.ref_no}>{item.ref_no}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<!-- <div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm ">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

				<div class="flex items-center space-x-2">
					<select
						class="select-sm w-full max-w-xs h-1 rounded-md bg-white"
						bind:value={limit}
						on:change={firstPage}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
						<option value={20}>20</option>
						<option value={25}>25</option>
						<option value={30}>30</option>
					</select>

					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={prevPage}
						disabled={currentPage === 1}
					>
						ย้อนกลับ
					</button>
					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={nextPage}
						disabled={currentPage === totalPages}
					>
						ต่อไป
					</button>
				</div>
			</div>
		</div> -->
	</div>
	<div class="card shadow p-2">

	<div class="mb-3">
		<div class="d-flex align-items-center mb-1 flex-wrap">
			<small class="px-2 rounded-pill text-nowrap bg-success-subtle text-success">TRANSACTION SUCCESSFUL</small>
			<div class="ml-2">การตรวจธุรกรรมสำเร็จ</div>
		</div>
		<div class="d-flex align-items-center mb-1 flex-wrap">
			<small class="px-2 rounded-pill text-nowrap bg-danger-subtle text-danger">TRANSACTION UNSUCCESSFUL</small>
			<div class="ml-5">การตรวจธุรกรรมไม่สำเร็จ</div>
		</div>
		<div class="d-flex align-items-center mb-1 flex-wrap">
			<small class="px-2 rounded-pill text-nowrap bg-danger-subtle text-danger">TRANSACTION SUCCESSFUL</small>
			<div class="ml-2">Bank Account Not Match เลขบัญชีธนาคารของผู้รับไม่ตรงกับที่ลงทะเบียน</div>
		</div>
		<div class="d-flex align-items-center mb-1 flex-wrap">
			<small class="px-2 rounded-pill text-nowrap bg-danger-subtle text-danger">AMOUNT LESS THAN MINIMUM</small>
			<div class="ml-2">
				AMOUNT LESS THAN MINIMUM จำนวนเงินที่ส่งมามีต่ำกว่าจำจวนเงินขั้นต่ำที่กำหนด
			</div>
		</div>
		<div class="d-flex align-items-center mb-1 flex-wrap">
			<small class="px-2 rounded-pill text-nowrap bg-danger-subtle text-danger">ERROR</small>
			<div class="ml-2">การตอบกลับถูกปฏิเสธ</div>
		</div>
	</div>
	</div>
</div>

<style>
	.text-success-bg {
		background-color: #dcfae6; /* พื้นหลังสีเขียวอ่อน */
		color: #17b26a; /* สีตัวอักษรสีเขียวเข้ม */
	}

	.text-pending-bg {
		background-color: #fef0c7; /* พื้นหลังสีเหลืองอ่อน */
		color: #f79009; /* สีตัวอักษรสีเหลืองเข้ม */
	}

	.text-rejected-bg {
		background-color: #fee4e2; /* พื้นหลังสีแดงอ่อน */
		color: #f04438; /* สีตัวอักษรสีแดงเข้ม */
	}
	.text-respond-rejected-bg {
		background-color: #f9fafb;
		color: #61646c;
	}
	.text-request-rejected-bg {
		background-color: #f9fafb;
		color: #61646c;
	}

	.text-bank-acc-not-match-bg {
		background-color: #f9fafb;
		color: #61646c;
	}

	.text-INVALID_MIN_AMOUNT_RECEIVE-bg {
		background-color: #f9fafb;
		color: #61646c;
	}
</style>
